import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false, // Return plain URLs instead of FileOutput objects
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 requests per hour per IP
    const clientIP = getClientIP(request.headers);
    const rateLimit = checkRateLimit(`enhance:${clientIP}`, 30, 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Te veel verzoeken. Probeer het later opnieuw.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Check for API token
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token niet geconfigureerd" },
        { status: 500 }
      );
    }

    // Check authentication and credits
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om foto's te verbeteren", requireLogin: true },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "Je hebt geen credits meer. Koop meer credits om door te gaan.", noCredits: true },
        { status: 402 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Geen afbeelding ontvangen" },
        { status: 400 }
      );
    }

    // Convert file to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Use Real-ESRGAN for image enhancement
    const output = await replicate.run(
      "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      {
        input: {
          image: dataUrl,
          scale: 2,
          face_enhance: false,
        },
      }
    );

    // Handle different output formats from Replicate
    // The SDK can return: string URL, array of URLs, FileOutput object, or ReadableStream
    let enhancedImageUrl: string;

    // Helper to extract URL from various formats
    const extractUrl = (item: unknown): string | null => {
      if (typeof item === "string") {
        return item;
      }
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;

        // Check for url() method (FileOutput in newer SDK versions)
        if (typeof obj.url === "function") {
          const url = (obj.url as () => string)();
          if (typeof url === "string" && url.startsWith("http")) {
            return url;
          }
        }

        // Check for url property
        if (typeof obj.url === "string" && obj.url.startsWith("http")) {
          return obj.url;
        }

        // FileOutput objects have a toString() that returns the URL
        // But we need to check it's not just "[object Object]" or "[object ReadableStream]"
        const str = String(item);
        if (str.startsWith("http")) {
          return str;
        }
      }
      return null;
    };

    if (typeof output === "string") {
      enhancedImageUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      const url = extractUrl(output[0]);
      if (url) {
        enhancedImageUrl = url;
      } else {
        console.error("Unexpected array item format. Type:", typeof output[0], "Value:", String(output[0]).substring(0, 100));
        return NextResponse.json(
          { error: "Onverwacht antwoord van de AI service" },
          { status: 500 }
        );
      }
    } else if (output && typeof output === "object") {
      const url = extractUrl(output);
      if (url) {
        enhancedImageUrl = url;
      } else {
        console.error("Unexpected object output format. Type:", (output as object).constructor?.name, "String:", String(output).substring(0, 100));
        return NextResponse.json(
          { error: "Onverwacht antwoord van de AI service" },
          { status: 500 }
        );
      }
    } else {
      console.error("Unexpected Replicate output format:", typeof output, output);
      return NextResponse.json(
        { error: "Onverwacht antwoord van de AI service" },
        { status: 500 }
      );
    }

    if (!enhancedImageUrl || typeof enhancedImageUrl !== "string") {
      return NextResponse.json(
        { error: "Geen geldige afbeelding ontvangen van de AI service" },
        { status: 500 }
      );
    }

    // Deduct credit after successful enhancement
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    });

    // Log usage with history data
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        type: "enhancement",
        originalSize: file.size,
        enhancedImageUrl: enhancedImageUrl,
        originalFileName: file.name || "foto.jpg",
      },
    });

    return NextResponse.json({
      success: true,
      enhancedImageUrl,
      message: "Foto succesvol verbeterd!",
      remainingCredits: user.credits - 1,
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het verbeteren van de foto" },
      { status: 500 }
    );
  }
}

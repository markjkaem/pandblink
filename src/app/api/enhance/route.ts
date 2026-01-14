import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

type PresetType = "standard" | "premium" | "crystal";

interface EnhancementOptions {
  strength?: number;
  faceEnhance?: boolean;
}

function getCreditCost(preset: PresetType): number {
  const costs: Record<PresetType, number> = {
    standard: 1,
    premium: 2,
    crystal: 2,
  };
  return costs[preset] || 1;
}

function getModelConfig(preset: PresetType, options: EnhancementOptions) {
  switch (preset) {
    case "standard":
      // Clarity Upscaler - kleur en contrast verbetering, geen hallucinaties
      return {
        model: "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
        input: {
          prompt: "professional real estate photo, enhanced colors, better contrast, brighter, vibrant but natural",
          negative_prompt: "dark, blurry, low quality, artifacts, changes to structure, added objects",
          scale: 2,
          creativity: 0.2,
          resemblance: 0.95,
          num_inference_steps: 18,
        },
      };
    case "premium":
      // Magic Image Refiner - HDR en kleuren, behoud origineel
      return {
        model: "fermatresearch/magic-image-refiner:507ddf6f977a7e30e46c0daefd30de7d563c72322f9e4cf7cbac52ef0f667b13",
        input: {
          prompt: "professional real estate photography, bright natural lighting, vibrant colors, enhanced contrast, HDR look",
          negative_prompt: "dark, blurry, artifacts, changes to structure, added objects, hallucinations",
          hdr: 0.4,
          creativity: 0.25,
          resemblance: 0.85,
          resolution: "original",
          steps: 20,
          guidance_scale: 7,
        },
      };
    case "crystal":
      // Crystal Clear - meer effect maar nog steeds veilig
      return {
        model: "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
        input: {
          prompt: "professional real estate photo, HDR, bright natural lighting, vivid colors, enhanced contrast, sharp",
          negative_prompt: "dark, blurry, low quality, artifacts, changes to structure, added objects, hallucinations",
          scale: 2,
          creativity: 0.3,
          resemblance: 0.9,
          num_inference_steps: 20,
        },
      };
    default:
      // Fallback to standard
      return {
        model: "philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e",
        input: {
          prompt: "professional real estate photo, enhanced colors, better contrast, brighter",
          negative_prompt: "dark, blurry, artifacts, changes to structure, added objects",
          scale: 2,
          creativity: 0.2,
          resemblance: 0.95,
          num_inference_steps: 18,
        },
      };
  }
}

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

    const formData = await request.formData();
    const file = formData.get("image") as File;
    const presetRaw = formData.get("preset") as string | null;
    const optionsRaw = formData.get("options") as string | null;

    // Parse preset and options
    const preset: PresetType = (presetRaw === "premium" || presetRaw === "crystal")
      ? presetRaw
      : "standard";

    let options: EnhancementOptions = {};
    try {
      if (optionsRaw) {
        options = JSON.parse(optionsRaw);
      }
    } catch {
      // Use default options if parsing fails
    }

    const creditCost = getCreditCost(preset);

    if (!user || user.credits < creditCost) {
      return NextResponse.json(
        {
          error: `Je hebt niet genoeg credits. Deze verbetering kost ${creditCost} credit${creditCost > 1 ? "s" : ""}.`,
          noCredits: true,
          required: creditCost,
          available: user?.credits || 0,
        },
        { status: 402 }
      );
    }

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

    // Get model config based on preset
    const modelConfig = getModelConfig(preset, options);

    // Run enhancement with the appropriate model
    const output = await replicate.run(
      modelConfig.model as `${string}/${string}:${string}`,
      {
        input: {
          ...modelConfig.input,
          image: dataUrl,
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

    // Deduct credits after successful enhancement
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditCost } },
    });

    // Log usage with history data and enhancement options
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        type: "enhancement",
        originalSize: file.size,
        enhancedImageUrl: enhancedImageUrl,
        originalFileName: file.name || "foto.jpg",
        preset: preset,
        creditsCost: creditCost,
        options: Object.keys(options).length > 0 ? JSON.parse(JSON.stringify(options)) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      enhancedImageUrl,
      message: "Foto succesvol verbeterd!",
      remainingCredits: user.credits - creditCost,
      preset,
      creditsCost: creditCost,
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het verbeteren van de foto" },
      { status: 500 }
    );
  }
}

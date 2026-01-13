import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Check credits
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ credits: 0, loggedIn: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    return NextResponse.json({
      credits: user?.credits ?? 0,
      loggedIn: true,
    });
  } catch (error) {
    console.error("Credits check error:", error);
    return NextResponse.json({ credits: 0, loggedIn: false });
  }
}

// POST: Use a credit
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om credits te gebruiken" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "Je hebt geen credits meer. Koop meer credits om door te gaan." },
        { status: 402 }
      );
    }

    // Deduct credit
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    });

    // Log usage
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        type: "enhancement",
      },
    });

    return NextResponse.json({
      success: true,
      remainingCredits: user.credits - 1,
    });
  } catch (error) {
    console.error("Credit use error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 }
    );
  }
}

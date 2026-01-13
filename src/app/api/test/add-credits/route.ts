import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// TEST ONLY - Verwijder in productie!
// Voegt credits toe zonder betaling
export async function POST(request: NextRequest) {
  // Alleen in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn" },
        { status: 401 }
      );
    }

    const { credits = 10 } = await request.json().catch(() => ({}));

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: credits } },
    });

    return NextResponse.json({
      success: true,
      credits: user.credits,
      message: `${credits} credits toegevoegd (TEST)`,
    });
  } catch (error) {
    console.error("Test credits error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn" },
        { status: 401 }
      );
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Geen sessie ID" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment was successful
    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Betaling niet voltooid" },
        { status: 400 }
      );
    }

    // Verify this session belongs to the current user
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Ongeldige sessie" },
        { status: 403 }
      );
    }

    // Check if we already processed this session (prevent double-crediting)
    const existingUsage = await prisma.usage.findFirst({
      where: {
        userId: session.user.id,
        type: "purchase",
        stripeSessionId: sessionId,
      },
    });

    if (existingUsage) {
      // Already processed, return current credits
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        credits: user?.credits || 0,
      });
    }

    // Get credits from metadata
    const creditsToAdd = parseInt(checkoutSession.metadata?.credits || "0", 10);

    if (creditsToAdd <= 0) {
      return NextResponse.json(
        { error: "Ongeldig credit aantal" },
        { status: 400 }
      );
    }

    // Add credits to user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: creditsToAdd } },
      select: { credits: true },
    });

    // Log the purchase to prevent double-crediting
    await prisma.usage.create({
      data: {
        userId: session.user.id,
        type: "purchase",
        stripeSessionId: sessionId,
        creditsAdded: creditsToAdd,
      },
    });

    return NextResponse.json({
      success: true,
      creditsAdded: creditsToAdd,
      credits: updatedUser.credits,
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het verifiëren van de betaling" },
      { status: 500 }
    );
  }
}

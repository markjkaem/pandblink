import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, CREDIT_PACKAGES } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 checkout attempts per hour per IP
    const clientIP = getClientIP(request.headers);
    const rateLimit = checkRateLimit(`checkout:${clientIP}`, 10, 60 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Te veel betalingspogingen. Probeer het later opnieuw.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn" },
        { status: 401 }
      );
    }

    const { packageId } = await request.json();
    const creditPackage = CREDIT_PACKAGES.find((p) => p.id === packageId);

    if (!creditPackage) {
      return NextResponse.json(
        { error: "Ongeldig pakket" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true },
    });

    let customerId = user?.stripeCustomerId;

    // Verify customer exists in Stripe (handles test->live mode switch)
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch {
        // Customer doesn't exist in this Stripe mode, reset it
        customerId = null;
      }
    }

    // Create new customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: creditPackage.name,
              description: `${creditPackage.credits} foto verbeteringen voor Pandblink`,
            },
            unit_amount: creditPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/credits?canceled=true`,
      metadata: {
        userId: session.user.id,
        packageId: creditPackage.id,
        credits: creditPackage.credits.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Onbekende fout";
    return NextResponse.json(
      { error: `Betaling fout: ${errorMessage}` },
      { status: 500 }
    );
  }
}

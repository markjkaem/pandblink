import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe, CREDIT_PACKAGES } from "@/lib/stripe";
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

    const { packageId } = await request.json();
    const creditPackage = CREDIT_PACKAGES.find((p) => p.id === packageId);

    if (!creditPackage) {
      return NextResponse.json(
        { error: "Ongeldig pakket" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true },
    });

    let customerId = user?.stripeCustomerId;

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
      success_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/?success=true&credits=${creditPackage.credits}`,
      cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/?canceled=true`,
      metadata: {
        userId: session.user.id,
        packageId: creditPackage.id,
        credits: creditPackage.credits.toString(),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het starten van de betaling" },
      { status: 500 }
    );
  }
}

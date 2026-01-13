import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

// Credit packages
export const CREDIT_PACKAGES = [
  {
    id: "credits_10",
    name: "10 Credits",
    credits: 10,
    price: 900, // €9.00 in cents
    priceDisplay: "€9",
    perCredit: "€0.90",
  },
  {
    id: "credits_25",
    name: "25 Credits",
    credits: 25,
    price: 1900, // €19.00 in cents
    priceDisplay: "€19",
    perCredit: "€0.76",
    popular: true,
  },
  {
    id: "credits_50",
    name: "50 Credits",
    credits: 50,
    price: 2900, // €29.00 in cents
    priceDisplay: "€29",
    perCredit: "€0.58",
  },
];

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Enhancement preset types and costs
export type PresetType = "standard" | "premium" | "crystal";

export function getCreditCost(preset: PresetType): number {
  const costs: Record<PresetType, number> = {
    standard: 1,
    premium: 2,
    crystal: 2,
  };
  return costs[preset] || 1;
}

export const PRESET_INFO: Record<PresetType, {
  name: string;
  description: string;
  credits: number;
  badge?: string;
}> = {
  standard: {
    name: "Standaard",
    description: "Snelle verbetering met goede kwaliteit",
    credits: 1,
  },
  premium: {
    name: "Premium",
    description: "Hogere kwaliteit met meer contrast",
    credits: 2,
    badge: "Populair",
  },
  crystal: {
    name: "Crystal Clear",
    description: "Beste detail en scherpte",
    credits: 2,
    badge: "Pro",
  },
};

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

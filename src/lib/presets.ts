// Enhancement preset types and costs - client-safe utilities

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

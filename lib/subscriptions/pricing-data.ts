export const PRICING_DATA = {
  monthly: {
    starter: { price: null, pricingLabel: "Free", description: null },
    professional: { price: 9.99, pricingLabel: null, description: null },
    business: {
      price: 299,
      pricingLabel: null,
      description: "Once",
      periodLabel: "/once",
    },
  },
  yearly: {
    starter: { price: null, pricingLabel: "Free", description: null },
    professional: { price: 99, pricingLabel: null, description: null },
    business: {
      price: 299,
      pricingLabel: null,
      description: "Once",
      periodLabel: "/once",
    },
  },
} as const;

export function getTierDisplayName(tier: "free" | "pro" | "lifetime"): string {
  switch (tier) {
    case "free":
      return "Starter";
    case "pro":
      return "Pro";
    case "lifetime":
      return "Lifetime";
    default:
      return "Starter";
  }
}

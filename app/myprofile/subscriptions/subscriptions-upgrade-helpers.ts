import type { Tier } from "@/lib/subscriptions/tier";

export type NextTierInfo = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
};

export function getNextTierInfo(
  effectiveTier: Tier,
  billingYearly: boolean,
): NextTierInfo | null {
  if (effectiveTier === "free") {
    return {
      name: "Pro",
      price: billingYearly ? "$99" : "$9.99",
      period: billingYearly ? "/year" : "/month",
      description: "Unlock advanced features and scale your operations",
      features: [
        "All Starter features",
        "Up to 100 enhancements",
        "API access",
        "Presets",
        "Organise with folders",
        "Priority support",
      ],
    };
  }

  if (effectiveTier === "pro") {
    return {
      name: "Lifetime",
      price: "$299",
      period: "/once",
      description: "One-time payment for lifetime access",
      features: [
        "All Pro features",
        "Up to 500 enhancements",
        "Workflows",
        "Company account",
        "User roles & permissions",
        "Lifetime access",
      ],
    };
  }

  return null;
}

export function getNextTier(effectiveTier: Tier): "pro" | "lifetime" {
  if (effectiveTier === "free") return "pro";
  if (effectiveTier === "pro") return "lifetime";
  return "lifetime";
}

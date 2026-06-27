import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { Tier } from "@/lib/subscriptions/tier";
import type { PRICING_DATA } from "@/lib/subscriptions/pricing-data";

type PricingPeriod = typeof PRICING_DATA.monthly | typeof PRICING_DATA.yearly;

type PricingCardPropsInput = {
  tier: Tier;
  billingYearly: boolean;
  checkoutLoading: string | null;
  authReady: boolean;
  push: AppRouterInstance["push"];
  handleCheckout: (
    checkoutTier: "pro" | "lifetime",
    cycle?: "month" | "year",
  ) => Promise<void>;
  currentPricing: PricingPeriod;
};

export function buildStarterCardProps({
  tier,
  authReady,
  push,
  currentPricing,
}: Pick<
  PricingCardPropsInput,
  "tier" | "authReady" | "push" | "currentPricing"
>) {
  return {
    plan: "Starter",
    price: currentPricing.starter.price,
    pricingLabel: currentPricing.starter.pricingLabel,
    recommended: false,
    periodLabel: "Forever",
    features: ["AI Super Resolution", "Basic enhancements", "Standard support"],
    buttonText: tier === "free" ? "Current plan" : undefined,
    buttonVariant: tier === "free" ? "current" : undefined,
    disabled: tier === "free",
    onClick: () => {
      if (authReady) {
        push("/myprofile/profile-details");
      } else {
        push("/signin");
      }
    },
  };
}

export function buildProCardProps({
  tier,
  billingYearly,
  checkoutLoading,
  handleCheckout,
  currentPricing,
}: Pick<
  PricingCardPropsInput,
  | "tier"
  | "billingYearly"
  | "checkoutLoading"
  | "handleCheckout"
  | "currentPricing"
>) {
  return {
    plan: "Pro",
    price: currentPricing.professional.price,
    recommended: true,
    backgroundColor: "bg-red-500",
    periodLabel: billingYearly ? "/yearly" : "/month",
    discountText: billingYearly ? "10% off" : undefined,
    features: [
      "All Starter features",
      "Up to 100 enhancements",
      "API access",
      "Presets",
      "Organise with folders",
    ],
    buttonText:
      tier === "pro"
        ? "Current plan"
        : tier === "lifetime"
          ? undefined
          : checkoutLoading === "pro"
            ? "Loading..."
            : "Upgrade to Pro",
    buttonVariant: tier === "pro" ? "current" : "default",
    disabled: tier === "pro" || tier === "lifetime" || checkoutLoading !== null,
    onClick:
      tier !== "pro" && tier !== "lifetime"
        ? () => handleCheckout("pro", billingYearly ? "year" : "month")
        : undefined,
  };
}

export function buildLifetimeCardProps({
  tier,
  checkoutLoading,
  handleCheckout,
  currentPricing,
}: Pick<
  PricingCardPropsInput,
  "tier" | "checkoutLoading" | "handleCheckout" | "currentPricing"
>) {
  return {
    plan: "Lifetime",
    price: currentPricing.business.price,
    recommended: false,
    periodLabel: "/once",
    features: [
      "All Pro features",
      "Up to 500 enhancements",
      "Workflows",
      "Company account",
      "User roles & permissions",
    ],
    buttonText:
      tier === "lifetime"
        ? "Current plan"
        : checkoutLoading === "lifetime"
          ? "Loading..."
          : "Upgrade to Lifetime",
    buttonVariant: tier === "lifetime" ? "current" : "default",
    disabled: tier === "lifetime" || checkoutLoading !== null,
    borderColor: "border-red-500",
    onClick: tier !== "lifetime" ? () => handleCheckout("lifetime") : undefined,
  };
}

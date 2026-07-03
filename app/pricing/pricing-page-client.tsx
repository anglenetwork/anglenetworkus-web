"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PricingCard from "@/app/components/ui/pricing-card";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { PRICING_DATA } from "@/lib/subscriptions/pricing-data";
import { usePricingSubscription } from "./use-pricing-subscription";
import {
  buildLifetimeCardProps,
  buildProCardProps,
  buildStarterCardProps,
} from "./pricing-card-props";
import { PricingBillingToggle, PricingFaq } from "./pricing-faq";

export default function PricingPage() {
  const { push } = useRouter();
  const [billingYearly, setBillingYearly] = useState(false);
  const { tier, error, checkoutLoading, authReady, handleCheckout } =
    usePricingSubscription();

  const currentPricing = billingYearly
    ? PRICING_DATA.yearly
    : PRICING_DATA.monthly;

  const cardPropsInput = {
    tier,
    billingYearly,
    checkoutLoading,
    authReady,
    push,
    handleCheckout,
    currentPricing,
  };

  return (
    <SitePageWidth className="pt-10 pb-20 font-sans">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl text-gray-900 md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-lg">
          Select the perfect plan for your needs. Upgrade or downgrade at any
          time.
        </p>
      </div>

      <PricingBillingToggle
        billingYearly={billingYearly}
        onBillingYearlyChange={setBillingYearly}
      />

      {/* Error Message */}
      {error ? (
        <div className="mx-auto mb-6 max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        </div>
      ) : null}

      {/* Pricing Cards */}
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center">
        <PricingCard {...buildStarterCardProps(cardPropsInput)} />
        <PricingCard {...buildProCardProps(cardPropsInput)} />
        <PricingCard {...buildLifetimeCardProps(cardPropsInput)} />
      </div>

      <PricingFaq />
    </SitePageWidth>
  );
}

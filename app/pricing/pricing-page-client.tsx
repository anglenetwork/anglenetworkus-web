"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PricingCard from "@/app/components/ui/pricing-card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import { type Tier } from "@/lib/subscriptions/tier";
import { PRICING_DATA } from "@/lib/subscriptions/pricing-data";
import type { PostgrestError } from "@supabase/supabase-js";

export default function PricingPage() {
  const { push } = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();

  const [tier, setTier] = useState<Tier>("free");
  const [billingYearly, setBillingYearly] = useState(false); // OFF => monthly, ON => yearly
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPricing = billingYearly
    ? PRICING_DATA.yearly
    : PRICING_DATA.monthly;

  const loadSubscription = useCallback(async () => {
    if (!authReady) {
      return;
    }

    try {
      setError(null);

      // Ensure subscription row exists (idempotent)
      const ensure = await supabase.rpc("ensure_subscription_row");
      if (ensure.error) throw ensure.error;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("tier, valid_until, status, billing_cycle")
        .maybeSingle();

      if (error) throw error;

      const tier = (data?.tier ?? "free") as Tier;
      setTier(tier);
    } catch (e: unknown) {
      const msg =
        (e as PostgrestError)?.message ??
        (e as { message?: string })?.message ??
        "Failed to load subscription data.";
      setError(msg);
    }
  }, [authReady, supabase]);

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  async function handleCheckout(
    tier: "pro" | "lifetime",
    cycle?: "month" | "year",
  ) {
    try {
      setCheckoutLoading(tier);
      setError(null);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, cycle }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e: unknown) {
      const msg =
        (e as Error)?.message ?? "Failed to start checkout. Please try again.";
      setError(msg);
      setCheckoutLoading(null);
    }
  }

  return (
    <div className="pt-10 pb-20 font-sans">
      {/* Header Section */}
      <div className="mb-12 px-4 text-center">
        <h1 className="mb-4 font-bold text-4xl text-gray-900 md:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-lg">
          Select the perfect plan for your needs. Upgrade or downgrade at any
          time.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="mb-12 flex justify-center">
        <div className="flex items-center justify-center gap-4 rounded-full border border-gray-300 bg-transparent px-4 py-2">
          <span
            className={`font-semibold text-lg ${!billingYearly ? "text-gray-900" : "text-gray-500"}`}
          >
            Billed monthly
          </span>
          <Switch checked={billingYearly} onCheckedChange={setBillingYearly} />
          <span
            className={`font-semibold text-lg ${billingYearly ? "text-gray-900" : "text-gray-500"}`}
          >
            Billed yearly
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error ? (
        <div className="mx-auto mb-6 max-w-4xl px-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        </div>
      ) : null}

      {/* Pricing Cards */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center">
          {/* Starter Plan - Free */}
          <PricingCard
            plan="Starter"
            price={currentPricing.starter.price}
            pricingLabel={currentPricing.starter.pricingLabel}
            recommended={false}
            periodLabel="Forever"
            features={[
              "AI Super Resolution",
              "Basic enhancements",
              "Standard support",
            ]}
            buttonText={tier === "free" ? "Current plan" : undefined}
            buttonVariant={tier === "free" ? "current" : undefined}
            disabled={tier === "free"}
            onClick={() => {
              if (authReady) {
                push("/myprofile/profile-details");
              } else {
                push("/signin");
              }
            }}
          />

          {/* Professional Plan - Recommended */}
          <PricingCard
            plan="Pro"
            price={currentPricing.professional.price}
            recommended={true}
            backgroundColor="bg-red-500"
            periodLabel={billingYearly ? "/yearly" : "/month"}
            discountText={billingYearly ? "10% off" : undefined}
            features={[
              "All Starter features",
              "Up to 100 enhancements",
              "API access",
              "Presets",
              "Organise with folders",
            ]}
            buttonText={
              tier === "pro"
                ? "Current plan"
                : tier === "lifetime"
                  ? undefined
                  : checkoutLoading === "pro"
                    ? "Loading..."
                    : "Upgrade to Pro"
            }
            buttonVariant={tier === "pro" ? "current" : "default"}
            disabled={
              tier === "pro" || tier === "lifetime" || checkoutLoading !== null
            }
            onClick={
              tier !== "pro" && tier !== "lifetime"
                ? () => handleCheckout("pro", billingYearly ? "year" : "month")
                : undefined
            }
          />

          {/* Lifetime Plan */}
          <PricingCard
            plan="Lifetime"
            price={currentPricing.business.price}
            recommended={false}
            periodLabel="/once"
            features={[
              "All Pro features",
              "Up to 500 enhancements",
              "Workflows",
              "Company account",
              "User roles & permissions",
            ]}
            buttonText={
              tier === "lifetime"
                ? "Current plan"
                : checkoutLoading === "lifetime"
                  ? "Loading..."
                  : "Upgrade to Lifetime"
            }
            buttonVariant={tier === "lifetime" ? "current" : "default"}
            disabled={tier === "lifetime" || checkoutLoading !== null}
            borderColor="border-red-500"
            onClick={
              tier !== "lifetime" ? () => handleCheckout("lifetime") : undefined
            }
          />
        </div>
      </div>

      {/* FAQ or Additional Info Section */}
      <div className="mx-auto mt-16 max-w-4xl px-4">
        <div className="text-center">
          <h2 className="mb-6 font-bold text-2xl text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 text-left md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Can I change plans later?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time from
                your account settings.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards and process payments securely
                through Stripe.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 text-sm">
                The Starter plan is free forever. Pro plans start immediately
                after payment.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription at any time. You&apos;ll
                continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

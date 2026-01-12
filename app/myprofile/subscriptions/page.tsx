"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import PricingCard from "@/app/components/ui/pricing-card";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";

import { type Tier } from "@/lib/subscriptions/tier";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function SubscriptionsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>("free");
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [billingYearly, setBillingYearly] = useState(false); // OFF => monthly, ON => yearly
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const pricingData = {
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
  };

  const currentPricing = billingYearly
    ? pricingData.yearly
    : pricingData.monthly;

  async function loadSubscription() {
    setError(null);

    // Ensure subscription row exists (idempotent). This avoids "empty subscriptions" on first login.
    const ensure = await supabase.rpc("ensure_subscription_row");
    if (ensure.error) throw ensure.error;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("tier, valid_until, status, billing_cycle")
      .maybeSingle();

    if (error) throw error;

    const tier = (data?.tier ?? "free") as Tier;
    const validUntil = data?.valid_until ?? null;
    const status = data?.status ?? null;

    setTier(tier);
    setValidUntil(validUntil);
    setStatus(status);
  }

  useEffect(() => {
    if (!authReady) {
      return;
    }

    (async () => {
      try {
        setLoading(true);
        await loadSubscription();
      } catch (e: unknown) {
        const msg =
          (e as PostgrestError)?.message ??
          (e as any)?.message ??
          "Failed to load subscription data.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);

  // Check for canceled parameter
  useEffect(() => {
    if (searchParams?.get("canceled") === "1") {
      setError(
        "Checkout was canceled. Please try again if you'd like to upgrade."
      );
      // Remove the parameter from URL
      router.replace("/myprofile/subscriptions", { scroll: false });
    }
  }, [searchParams, router]);

  async function handleCheckout(
    tier: "pro" | "lifetime",
    cycle?: "month" | "year"
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

  function getNextTier(): "pro" | "lifetime" {
    if (tier === "free") return "pro";
    if (tier === "pro") return "lifetime";
    return "lifetime"; // Already at lifetime
  }

  const getTierDisplayName = (tier: Tier) => {
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
  };

  const getValidUntilText = () => {
    if (!validUntil) return "Forever";
    return formatDate(validUntil);
  };

  async function handleCancelSubscription() {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period."
      )
    ) {
      return;
    }

    try {
      setCancelLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to cancel subscription");
      }

      // Reload subscription data
      await loadSubscription();

      setError(null);
      alert(
        "Your subscription has been canceled. You'll continue to have access until the end of your billing period."
      );
    } catch (e: unknown) {
      const msg =
        (e as Error)?.message ??
        "Failed to cancel subscription. Please try again.";
      setError(msg);
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="font-sans pt-10">
      {/* Current Tier Display */}
      <div className="mb-8 p-6 bg-gray-100 rounded-lg w-full space-y-1">
        {loading ? (
          <div className="text-gray-600 text-sm">Loading…</div>
        ) : (
          <>
            <div className="text-gray-600 text-xs uppercase tracking-wide font-semibold">
              Current tier
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="text-gray-900 text-2xl font-bold">
                {getTierDisplayName(tier)}
              </div>
              {tier !== "lifetime" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 bg-transparent"
                  onClick={() => {
                    const nextTier = getNextTier();
                    if (nextTier === "pro") {
                      handleCheckout("pro", billingYearly ? "year" : "month");
                    } else {
                      handleCheckout("lifetime");
                    }
                  }}
                  disabled={checkoutLoading !== null}
                >
                  {checkoutLoading ? "Loading..." : "Upgrade"}
                </Button>
              )}
            </div>
            <div className="text-gray-600 text-sm">
              Valid until: {getValidUntilText()}
            </div>
            {tier === "pro" && status !== "canceled" && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                >
                  {cancelLoading ? "Canceling..." : "Cancel Subscription"}
                </Button>
              </div>
            )}
            {status === "canceled" && (
              <div className="text-sm text-orange-600 mt-2">
                Subscription will end at the end of the billing period
              </div>
            )}
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </>
        )}
      </div>

      {/* Billing Toggle and Pricing Cards - Only show if not lifetime */}
      {tier !== "lifetime" && (
        <>
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center justify-center gap-4 px-4 py-2 rounded-full border border-gray-300 bg-transparent">
              <span
                className={`text-lg font-semibold ${!billingYearly ? "text-gray-900" : "text-gray-500"}`}
              >
                Billed monthly
              </span>
              <Switch
                checked={billingYearly}
                onCheckedChange={setBillingYearly}
              />
              <span
                className={`text-lg font-semibold ${billingYearly ? "text-gray-900" : "text-gray-500"}`}
              >
                Billed yearly
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
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
              buttonText={tier === "free" ? "Current subscription" : undefined}
              buttonVariant={tier === "free" ? "current" : undefined}
              disabled={tier === "free"}
            />

            {/* Professional Plan - Recommended */}
            <PricingCard
              plan="Pro"
              price={currentPricing.professional.price}
              recommended={true}
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
                  ? "Current subscription"
                  : checkoutLoading === "pro"
                    ? "Loading..."
                    : "Upgrade to Pro"
              }
              buttonVariant={tier === "pro" ? "current" : "default"}
              disabled={tier === "pro" || checkoutLoading !== null}
              onClick={
                tier !== "pro"
                  ? () =>
                      handleCheckout("pro", billingYearly ? "year" : "month")
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
                checkoutLoading === "lifetime"
                  ? "Loading..."
                  : "Upgrade to Lifetime"
              }
              buttonVariant="default"
              disabled={checkoutLoading !== null}
              borderColor="border-indigo-600"
              onClick={() => handleCheckout("lifetime")}
            />
          </div>
        </>
      )}
    </div>
  );
}

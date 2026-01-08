"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import PricingCard from "@/app/components/ui/pricing-card";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";

import { getTierFromEntitlements, type Tier } from "@/lib/subscriptions/tier";

type EntitlementRow = {
  key: string;
  active: boolean;
  valid_until: string | null;
};

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

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>("free");
  const [validUntil, setValidUntil] = useState<string | null>(null);

  const [billingYearly, setBillingYearly] = useState(false); // OFF => monthly, ON => yearly
  const [error, setError] = useState<string | null>(null);

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

  async function loadEntitlements() {
    setError(null);

    // Ensure free tier exists (idempotent). This avoids "empty entitlements" on first login.
    const ensure = await supabase.rpc("ensure_free_tier");
    if (ensure.error) throw ensure.error;

    const { data, error } = await supabase
      .from("entitlements")
      .select("key, active, valid_until")
      .in("key", ["tier:free", "tier:pro", "tier:lifetime"]);

    if (error) throw error;

    const rows = (data ?? []) as EntitlementRow[];
    const computed = getTierFromEntitlements(rows);

    setTier(computed.tier);
    setValidUntil(computed.validUntil);
  }

  useEffect(() => {
    if (!authReady) {
      return;
    }

    (async () => {
      try {
        setLoading(true);
        await loadEntitlements();
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

  // For now, purchase buttons are disabled until Stripe is implemented.
  // Later: clicking will start Stripe checkout and webhook will upsert entitlements.
  const purchasesEnabled = false;

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
              <Button
                variant="outline"
                size="sm"
                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 bg-transparent"
              >
                Upgrade
              </Button>
            </div>
            <div className="text-gray-600 text-sm">
              Valid until: {getValidUntilText()}
            </div>
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </>
        )}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center justify-center gap-4 px-4 py-2 rounded-full border border-gray-300 bg-transparent">
          <span
            className={`text-lg font-semibold ${!billingYearly ? "text-gray-900" : "text-gray-500"}`}
          >
            Billed monthly
          </span>
          <Switch checked={billingYearly} onCheckedChange={setBillingYearly} />
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
          buttonText={
            tier === "free" ? "Current subscription" : "Downgrade to Starter"
          }
          buttonVariant={tier === "free" ? "current" : "default"}
          disabled={tier === "free"}
        />

        {/* Professional Plan - Recommended */}
        <PricingCard
          plan="Pro"
          price={currentPricing.professional.price}
          recommended={true}
          periodLabel={billingYearly ? "/yearly" : "/month"}
          features={[
            "All Starter features",
            "Up to 100 enhancements",
            "API access",
            "Presets",
            "Organise with folders",
          ]}
          buttonText={
            tier === "pro" ? "Current subscription" : "Upgrade to Pro"
          }
          buttonVariant={tier === "pro" ? "current" : "default"}
          disabled={tier === "pro"}
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
            tier === "lifetime" ? "Current subscription" : "Upgrade to Lifetime"
          }
          buttonVariant={tier === "lifetime" ? "current" : "default"}
          disabled={tier === "lifetime"}
          borderColor="border-indigo-600"
        />
      </div>
    </div>
  );
}

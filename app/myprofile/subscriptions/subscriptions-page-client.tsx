"use client";

import { useEffect, useMemo, useReducer, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import { type Tier } from "@/lib/subscriptions/tier";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import {
  createInitialSubscriptionState,
  getEffectiveTier,
  subscriptionUiReducer,
} from "./subscription-ui-state";
import { SubscriptionsCurrentPlan } from "./subscriptions-current-plan";
import {
  getNextTier,
} from "./subscriptions-upgrade-helpers";
import { SubscriptionsUpgradeSection } from "./subscriptions-upgrade-section";
import { SubscriptionsFaq } from "./subscriptions-faq";

function SubscriptionsPageContent() {
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();
  const { replace } = useRouter();
  const { get } = useSearchParams();
  const checkoutCanceled = get("canceled") === "1";

  const [state, dispatch] = useReducer(
    subscriptionUiReducer,
    checkoutCanceled,
    createInitialSubscriptionState,
  );

  const loadSubscription = useCallback(async () => {
    dispatch({ type: "load_start" });

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
    const effectiveTier = getEffectiveTier(tier, validUntil);

    dispatch({
      type: "load_success",
      tier: effectiveTier,
      originalTier: tier,
      validUntil,
      status,
    });
  }, [supabase]);

  useEffect(() => {
    if (checkoutCanceled) {
      replace("/myprofile/subscriptions", { scroll: false });
    }
  }, [checkoutCanceled, replace]);

  useEffect(() => {
    if (!authReady) return;

    void (async () => {
      try {
        await loadSubscription();
      } catch (e: unknown) {
        const msg =
          (e as PostgrestError)?.message ??
          (e as { message?: string })?.message ??
          "Failed to load subscription data.";
        dispatch({ type: "load_error", error: msg });
      }
    })();
  }, [authReady, loadSubscription]);

  async function handleCheckout(
    tier: "pro" | "lifetime",
    cycle?: "month" | "year",
  ) {
    try {
      dispatch({ type: "checkout_start", tier });
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
      dispatch({ type: "set_error", error: msg });
      dispatch({ type: "checkout_end" });
    }
  }

  async function cancelProAtPeriodEnd() {
    try {
      dispatch({ type: "cancel_start" });
      const response = await fetch("/api/stripe/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ when: "period_end" }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Failed to cancel subscription");
      }

      await loadSubscription();
      dispatch({ type: "set_error", error: null });
    } catch (e: unknown) {
      const msg =
        (e as Error)?.message ??
        "Failed to cancel subscription. Please try again.";
      dispatch({ type: "set_error", error: msg });
    } finally {
      dispatch({ type: "cancel_end" });
    }
  }

  const effectiveTier = getEffectiveTier(state.tier, state.validUntil);

  function handleUpgrade() {
    const nextTier = getNextTier(effectiveTier);
    if (nextTier === "pro") {
      void handleCheckout("pro", state.billingYearly ? "year" : "month");
      return;
    }
    void handleCheckout("lifetime");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 font-sans">
      <div className="mx-auto max-w-7xl px-2">
        <ProfileSectionHeader
          title="Subscriptions"
          description="Manage your subscription and explore upgrade options"
        />
        {state.loading ? (
          <div className="py-16 text-center">
            <div className="text-muted-foreground">
              Loading subscription data…
            </div>
          </div>
        ) : (
          <>
            <SubscriptionsCurrentPlan
              originalTier={state.originalTier}
              billingYearly={state.billingYearly}
              validUntil={state.validUntil}
              status={state.status}
              error={state.error}
              cancelLoading={state.cancelLoading}
              onCancel={cancelProAtPeriodEnd}
            />
            <SubscriptionsUpgradeSection
              effectiveTier={effectiveTier}
              billingYearly={state.billingYearly}
              checkoutLoading={state.checkoutLoading}
              onUpgrade={handleUpgrade}
            />
            <SubscriptionsFaq />
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionsPageContent />
    </Suspense>
  );
}

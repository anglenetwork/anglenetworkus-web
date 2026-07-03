"use client";

import { useEffect, useReducer, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchSubscriptionStatus } from "@/app/lib/subscriptions/fetch-subscription-status-client";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import {
  createInitialSubscriptionState,
  getEffectiveTier,
  subscriptionUiReducer,
} from "./subscription-ui-state";
import { SubscriptionsCurrentPlan } from "./subscriptions-current-plan";
import { getNextTier } from "./subscriptions-upgrade-helpers";
import { SubscriptionsUpgradeSection } from "./subscriptions-upgrade-section";
import { SubscriptionsFaq } from "./subscriptions-faq";
import { profileSubscriptionLoading } from "@/app/lib/typography/myprofile-page";
import {
  extractPostgrestMessage,
  startStripeCheckout,
} from "@/lib/subscriptions/subscription-client";

function SubscriptionsPageContent() {
  const { ready: authReady } = useSupabaseAuth();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const checkoutCanceled = searchParams.get("canceled") === "1";

  const [state, dispatch] = useReducer(
    subscriptionUiReducer,
    checkoutCanceled,
    createInitialSubscriptionState,
  );

  const loadSubscription = useCallback(async () => {
    dispatch({ type: "load_start" });

    const status = await fetchSubscriptionStatus();
    if (!status) {
      throw new Error("Failed to load subscription data.");
    }

    dispatch({
      type: "load_success",
      tier: status.effectiveTier,
      originalTier: status.originalTier,
      validUntil: status.validUntil,
      status: status.status,
    });
  }, []);

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
        dispatch({
          type: "load_error",
          error: extractPostgrestMessage(
            e,
            "Failed to load subscription data.",
          ),
        });
      }
    })();
  }, [authReady, loadSubscription]);

  async function handleCheckout(
    tier: "pro" | "lifetime",
    cycle?: "month" | "year",
  ) {
    try {
      dispatch({ type: "checkout_start", tier });
      await startStripeCheckout(tier, cycle);
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
      <ProfileSectionHeader
        title="Subscriptions"
        description="Manage your subscription and explore upgrade options"
      />
      {state.loading ? (
        <div className="py-16 text-center">
          <div className={profileSubscriptionLoading}>
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
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionsPageContent />
    </Suspense>
  );
}

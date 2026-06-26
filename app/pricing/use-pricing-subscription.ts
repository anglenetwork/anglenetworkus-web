"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchSubscriptionStatus } from "@/app/lib/subscriptions/fetch-subscription-status-client";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import { type Tier } from "@/lib/subscriptions/tier";
import {
  extractPostgrestMessage,
  startStripeCheckout,
} from "@/lib/subscriptions/subscription-client";

export function usePricingSubscription() {
  const { ready: authReady } = useSupabaseAuth();

  const [tier, setTier] = useState<Tier>("free");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    if (!authReady) {
      return;
    }

    try {
      setError(null);
      const status = await fetchSubscriptionStatus();
      setTier(status?.effectiveTier ?? "free");
    } catch (e: unknown) {
      setError(extractPostgrestMessage(e, "Failed to load subscription data."));
    }
  }, [authReady]);

  useEffect(() => {
    void loadSubscription();
  }, [loadSubscription]);

  async function handleCheckout(
    checkoutTier: "pro" | "lifetime",
    cycle?: "month" | "year",
  ) {
    try {
      setCheckoutLoading(checkoutTier);
      setError(null);
      await startStripeCheckout(checkoutTier, cycle);
    } catch (e: unknown) {
      const msg =
        (e as Error)?.message ?? "Failed to start checkout. Please try again.";
      setError(msg);
      setCheckoutLoading(null);
    }
  }

  return {
    tier,
    error,
    checkoutLoading,
    authReady,
    loadSubscription,
    handleCheckout,
  };
}

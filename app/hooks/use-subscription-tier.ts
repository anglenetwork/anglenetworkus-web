"use client";

import { useEffect, useMemo, useState } from "react";
import { useDeferredIdle } from "@/app/hooks/use-deferred-idle";
import { fetchSubscriptionStatus } from "@/app/lib/subscriptions/fetch-subscription-status-client";
import { createClient } from "@/lib/supabase/client";
import type { Tier } from "@/lib/subscriptions/tier";

/**
 * Subscription tier for nav CTAs. Defers Supabase work until idle to reduce TBT on public pages.
 */
export function useSubscriptionTier() {
  const idleReady = useDeferredIdle();
  const supabase = useMemo(
    () => (idleReady ? createClient() : null),
    [idleReady],
  );
  const [tier, setTier] = useState<Tier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idleReady || !supabase) return;

    let mounted = true;

    const load = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (!mounted) return;
          setTier(null);
          setLoading(false);
          return;
        }

        const status = await fetchSubscriptionStatus();
        if (!mounted) return;
        setTier(status?.effectiveTier ?? "free");
        setLoading(false);
      } catch (error) {
        console.error("Error loading subscription:", error);
        if (!mounted) return;
        setTier("free");
        setLoading(false);
      }
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [idleReady, supabase]);

  return { tier, loading };
}

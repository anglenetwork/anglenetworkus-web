"use client";

import { useEffect, useMemo, useState } from "react";
import { useDeferredIdle } from "@/app/hooks/use-deferred-idle";
import { createClient } from "@/lib/supabase/client";
import type { Tier } from "@/lib/subscriptions/tier";

async function resolveEffectiveTier(
  supabase: ReturnType<typeof createClient>,
): Promise<Tier | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  try {
    await supabase.rpc("ensure_subscription_row");

    const { data, error } = await supabase
      .from("subscriptions")
      .select("tier, valid_until")
      .maybeSingle();

    if (error) throw error;

    let effectiveTier: Tier = (data?.tier ?? "free") as Tier;
    const validUntil = data?.valid_until;

    if (effectiveTier === "pro" && validUntil) {
      const until = new Date(validUntil);
      if (until < new Date()) {
        effectiveTier = "free";
      }
    }

    return effectiveTier;
  } catch (error) {
    console.error("Error loading subscription:", error);
    return "free";
  }
}

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
      const next = await resolveEffectiveTier(supabase);
      if (!mounted) return;
      setTier(next);
      setLoading(false);
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void resolveEffectiveTier(supabase).then((next) => {
        if (mounted) setTier(next);
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [idleReady, supabase]);

  return { tier, loading };
}

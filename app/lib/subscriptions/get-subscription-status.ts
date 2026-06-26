import type { SupabaseClient } from "@supabase/supabase-js";
import { getEffectiveTier } from "@/app/myprofile/subscriptions/subscription-ui-state";
import type { Tier } from "@/lib/subscriptions/tier";

export type SubscriptionStatus = {
  originalTier: Tier;
  effectiveTier: Tier;
  validUntil: string | null;
  status: string | null;
  billingCycle: string | null;
};

export async function getSubscriptionStatus(
  supabase: SupabaseClient,
): Promise<SubscriptionStatus> {
  const ensure = await supabase.rpc("ensure_subscription_row");
  if (ensure.error) throw ensure.error;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("tier, valid_until, status, billing_cycle")
    .maybeSingle();

  if (error) throw error;

  const originalTier = (data?.tier ?? "free") as Tier;
  const validUntil = data?.valid_until ?? null;

  return {
    originalTier,
    effectiveTier: getEffectiveTier(originalTier, validUntil),
    validUntil,
    status: data?.status ?? null,
    billingCycle: data?.billing_cycle ?? null,
  };
}

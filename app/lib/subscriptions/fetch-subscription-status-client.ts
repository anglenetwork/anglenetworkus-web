import type { SubscriptionStatus } from "./get-subscription-status";

export async function fetchSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  const res = await fetch("/api/subscriptions/status", { cache: "no-store" });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error || "Failed to load subscription status");
  }

  return (await res.json()) as SubscriptionStatus;
}

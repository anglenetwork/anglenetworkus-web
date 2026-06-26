import type { PostgrestError } from "@supabase/supabase-js";

export function extractPostgrestMessage(
  error: unknown,
  fallback: string,
): string {
  return (
    (error as PostgrestError)?.message ??
    (error as { message?: string })?.message ??
    fallback
  );
}

export async function startStripeCheckout(
  tier: "pro" | "lifetime",
  cycle?: "month" | "year",
): Promise<void> {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier, cycle }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error || "Failed to create checkout session",
    );
  }

  const { url } = (await response.json()) as { url?: string };
  if (url) {
    window.location.href = url;
    return;
  }

  throw new Error("No checkout URL returned");
}

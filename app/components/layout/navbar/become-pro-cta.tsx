"use client";

import Link from "next/link";
import { useDeferredIdle } from "@/app/hooks/use-deferred-idle";
import { useSubscriptionTier } from "@/app/hooks/use-subscription-tier";

/** Desktop nav “Become Pro” — defers Supabase tier lookup until idle. */
export function BecomeProCta() {
  const idleReady = useDeferredIdle();
  const { tier, loading } = useSubscriptionTier();

  if (!idleReady || loading || tier === "pro") {
    return null;
  }

  if (tier !== null && tier !== "free") {
    return null;
  }

  return (
    <Link
      href="/pricing"
      className="font-sans font-semibold text-red-600 text-sm transition-colors hover:underline"
    >
      Become Pro
    </Link>
  );
}

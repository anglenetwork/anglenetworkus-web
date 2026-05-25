"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import { type Tier } from "@/lib/subscriptions/tier";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>("free");
  const [polling, setPolling] = useState(true);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const maxPollAttempts = 30; // 30 seconds max

  const loadSubscription = useCallback(async () => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("tier, valid_until, status, billing_cycle")
      .maybeSingle();

    if (error) throw error;

    return (data?.tier ?? "free") as Tier;
  }, [supabase]);

  useEffect(() => {
    if (!authReady || !sessionId) {
      if (!sessionId) {
        setError("Missing session ID");
        setLoading(false);
      }
      return;
    }

    // Initial load
    (async () => {
      try {
        const currentTier = await loadSubscription();
        setTier(currentTier);
        setLoading(false);

        // If already upgraded, stop polling
        if (currentTier !== "free") {
          setPolling(false);
          return;
        }
      } catch (e: unknown) {
        const msg =
          (e as Error)?.message ?? "Failed to load subscription data.";
        setError(msg);
        setLoading(false);
        setPolling(false);
      }
    })();
  }, [authReady, sessionId, loadSubscription]);

  // Polling effect
  useEffect(() => {
    if (!polling || !authReady || tier !== "free") {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const currentTier = await loadSubscription();
        setTier(currentTier);
        setPollAttempts((prev) => prev + 1);

        // Stop polling if upgraded or max attempts reached
        if (currentTier !== "free" || pollAttempts >= maxPollAttempts) {
          setPolling(false);
          clearInterval(interval);
        }
      } catch (e: unknown) {
        console.error("Polling error:", e);
        // Continue polling on error
      }
    }, 1000); // Poll every 1 second

    return () => clearInterval(interval);
  }, [polling, authReady, tier, pollAttempts, loadSubscription]);

  if (!sessionId) {
    return (
      <div className="pt-10 font-sans">
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 font-bold text-red-900 text-xl">Error</h2>
          <p className="text-red-700">Missing session ID. Please try again.</p>
          <Link href="/myprofile/subscriptions">
            <Button className="mt-4">Back to Subscriptions</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-10 font-sans">
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="mb-2 font-bold text-red-900 text-xl">Error</h2>
          <p className="text-red-700">{error}</p>
          <Link href="/myprofile/subscriptions">
            <Button className="mt-4">Back to Subscriptions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isUpgraded = tier !== "free";
  const timeoutReached = pollAttempts >= maxPollAttempts;

  return (
    <div className="pt-10 font-sans">
      <div className="mb-8 w-full space-y-4 rounded-lg bg-gray-100 p-6">
        {loading ? (
          <div className="text-gray-600 text-sm">Loading…</div>
        ) : isUpgraded ? (
          <>
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Payment Successful!
            </h2>
            <p className="text-gray-700">
              Your subscription has been updated. You now have access to the{" "}
              <strong>{tier.toUpperCase()}</strong> tier.
            </p>
            <Link href="/myprofile/subscriptions">
              <Button className="mt-4">View My Subscriptions</Button>
            </Link>
          </>
        ) : timeoutReached ? (
          <>
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Payment Received
            </h2>
            <p className="text-gray-700">
              Your payment was successful, but we&apos;re still processing your
              subscription update. This usually takes just a few seconds.
            </p>
            <p className="mt-2 text-gray-600 text-sm">
              Your subscription will be active shortly. You can check your
              subscription status below.
            </p>
            <Link href="/myprofile/subscriptions">
              <Button className="mt-4">Check Subscription Status</Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className="mb-2 font-bold text-2xl text-gray-900">
              Payment Received
            </h2>
            <p className="text-gray-700">
              Payment received, updating your account...
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-indigo-600 border-b-2"></div>
              <span className="text-gray-600 text-sm">
                Please wait while we process your subscription
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

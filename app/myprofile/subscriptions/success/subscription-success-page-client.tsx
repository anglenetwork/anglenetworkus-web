"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import { type Tier } from "@/lib/subscriptions/tier";
import { Button } from "@/components/ui/button";
import {
  profileAlertErrorBody,
  profileAlertErrorTitle,
  profileSuccessBody,
  profileSuccessMeta,
  profileSuccessTitle,
  profileSubscriptionLoading,
} from "@/app/lib/typography/myprofile-page";

const MAX_POLL_ATTEMPTS = 30;

function SubscriptionSuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>("free");
  const [pollAttempts, setPollAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pollingActiveRef = useRef(true);

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

    pollingActiveRef.current = true;

    (async () => {
      try {
        const currentTier = await loadSubscription();
        setTier(currentTier);
        setLoading(false);

        if (currentTier !== "free") {
          pollingActiveRef.current = false;
        }
      } catch (e: unknown) {
        const msg =
          (e as Error)?.message ?? "Failed to load subscription data.";
        setError(msg);
        setLoading(false);
        pollingActiveRef.current = false;
      }
    })();
  }, [authReady, sessionId, loadSubscription]);

  const loadSubscriptionRef = useRef(loadSubscription);
  loadSubscriptionRef.current = loadSubscription;

  useEffect(() => {
    if (!authReady || tier !== "free" || !pollingActiveRef.current) {
      return;
    }

    const interval = setInterval(async () => {
      if (!pollingActiveRef.current) {
        return;
      }

      try {
        const currentTier = await loadSubscriptionRef.current();
        setTier(currentTier);

        setPollAttempts((prev) => {
          const next = prev + 1;
          if (currentTier !== "free" || next >= MAX_POLL_ATTEMPTS) {
            pollingActiveRef.current = false;
          }
          return next;
        });
      } catch (e: unknown) {
        console.error("Polling error:", e);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authReady, tier]);

  if (!sessionId) {
    return (
      <div className="pt-10 font-sans">
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className={profileAlertErrorTitle}>Error</h2>
          <p className={profileAlertErrorBody}>
            Missing session ID. Please try again.
          </p>
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
          <h2 className={profileAlertErrorTitle}>Error</h2>
          <p className={profileAlertErrorBody}>{error}</p>
          <Link href="/myprofile/subscriptions">
            <Button className="mt-4">Back to Subscriptions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isUpgraded = tier !== "free";
  const timeoutReached = pollAttempts >= MAX_POLL_ATTEMPTS;

  return (
    <div className="pt-10 font-sans">
      <div className="mb-8 w-full space-y-4 rounded-lg bg-gray-100 p-6">
        {loading ? (
          <div className={profileSubscriptionLoading}>Loading…</div>
        ) : isUpgraded ? (
          <>
            <h2 className={profileSuccessTitle}>Payment Successful!</h2>
            <p className={profileSuccessBody}>
              Your subscription has been updated. You now have access to the{" "}
              <strong>{tier.toUpperCase()}</strong> tier.
            </p>
            <Link href="/myprofile/subscriptions">
              <Button className="mt-4">View My Subscriptions</Button>
            </Link>
          </>
        ) : timeoutReached ? (
          <>
            <h2 className={profileSuccessTitle}>Payment Received</h2>
            <p className={profileSuccessBody}>
              Your payment was successful, but we&apos;re still processing your
              subscription update. This usually takes just a few seconds.
            </p>
            <p className={profileSuccessMeta}>
              Your subscription will be active shortly. You can check your
              subscription status below.
            </p>
            <Link href="/myprofile/subscriptions">
              <Button className="mt-4">Check Subscription Status</Button>
            </Link>
          </>
        ) : (
          <>
            <h2 className={profileSuccessTitle}>Payment Received</h2>
            <p className={profileSuccessBody}>
              Payment received, updating your account…
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="size-4 animate-spin rounded-full border-indigo-600 border-b-2"></div>
              <span className={profileSuccessMeta}>
                Please wait while we process your subscription
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionSuccessPageContent />
    </Suspense>
  );
}

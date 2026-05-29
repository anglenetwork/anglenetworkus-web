"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PricingCard from "@/app/components/ui/pricing-card";
import { useSupabaseAuth } from "@/app/providers/SupabaseAuthProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Zap, Users, Lock, ArrowRight } from "lucide-react";

import { type Tier } from "@/lib/subscriptions/tier";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function SubscriptionsPageContent() {
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();
  const { replace } = useRouter();
  const { get } = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>("free");
  const [originalTier, setOriginalTier] = useState<Tier>("free"); // Store original tier from DB
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [billingYearly, setBillingYearly] = useState(false); // OFF => monthly, ON => yearly
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const pricingData = {
    monthly: {
      starter: { price: null, pricingLabel: "Free", description: null },
      professional: { price: 9.99, pricingLabel: null, description: null },
      business: {
        price: 299,
        pricingLabel: null,
        description: "Once",
        periodLabel: "/once",
      },
    },
    yearly: {
      starter: { price: null, pricingLabel: "Free", description: null },
      professional: { price: 99, pricingLabel: null, description: null },
      business: {
        price: 299,
        pricingLabel: null,
        description: "Once",
        periodLabel: "/once",
      },
    },
  };

  const currentPricing = billingYearly
    ? pricingData.yearly
    : pricingData.monthly;

  async function loadSubscription() {
    setError(null);

    // Ensure subscription row exists (idempotent). This avoids "empty subscriptions" on first login.
    const ensure = await supabase.rpc("ensure_subscription_row");
    if (ensure.error) throw ensure.error;

    const { data, error } = await supabase
      .from("subscriptions")
      .select("tier, valid_until, status, billing_cycle")
      .maybeSingle();

    if (error) throw error;

    const tier = (data?.tier ?? "free") as Tier;
    const validUntil = data?.valid_until ?? null;
    const status = data?.status ?? null;

    // Store original tier from database
    setOriginalTier(tier);

    // Compute effective tier: if pro but expired, treat as free
    let effectiveTier = tier;
    if (tier === "pro" && validUntil) {
      const now = new Date();
      const until = new Date(validUntil);
      if (until < now) {
        effectiveTier = "free";
      }
    }

    setTier(effectiveTier);
    setValidUntil(validUntil);
    setStatus(status);
  }

  useEffect(() => {
    if (!authReady) {
      return;
    }

    (async () => {
      try {
        setLoading(true);
        await loadSubscription();
      } catch (e: unknown) {
        const msg =
          (e as PostgrestError)?.message ??
          (e as any)?.message ??
          "Failed to load subscription data.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady]);

  // Check for canceled parameter
  useEffect(() => {
    if (get("canceled") === "1") {
      setError(
        "Checkout was canceled. Please try again if you'd like to upgrade.",
      );
      // Remove the parameter from URL
      replace("/myprofile/subscriptions", { scroll: false });
    }
  }, [get, replace]);

  async function handleCheckout(
    tier: "pro" | "lifetime",
    cycle?: "month" | "year",
  ) {
    try {
      setCheckoutLoading(tier);
      setError(null);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, cycle }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e: unknown) {
      const msg =
        (e as Error)?.message ?? "Failed to start checkout. Please try again.";
      setError(msg);
      setCheckoutLoading(null);
    }
  }

  function getNextTier(): "pro" | "lifetime" {
    if (effectiveTier === "free") return "pro";
    if (effectiveTier === "pro") return "lifetime";
    return "lifetime"; // Already at lifetime
  }

  const getTierDisplayName = (tier: Tier) => {
    switch (tier) {
      case "free":
        return "Starter";
      case "pro":
        return "Pro";
      case "lifetime":
        return "Lifetime";
      default:
        return "Starter";
    }
  };

  // Compute effective tier: if pro but expired, treat as free
  const getEffectiveTier = (): Tier => {
    if (tier === "pro" && validUntil) {
      const now = new Date();
      const until = new Date(validUntil);
      if (until < now) {
        return "free";
      }
    }
    return tier;
  };

  const effectiveTier = getEffectiveTier();

  const getValidUntilText = () => {
    if (!validUntil) return "Forever";
    return formatDate(validUntil);
  };

  // Get current plan features based on tier
  const getCurrentPlanFeatures = (): string[] => {
    switch (originalTier) {
      case "pro":
        return [
          "All Starter features",
          "Up to 100 enhancements",
          "API access",
          "Presets",
          "Organise with folders",
          "Priority support",
        ];
      case "lifetime":
        return [
          "All Pro features",
          "Up to 500 enhancements",
          "Workflows",
          "Company account",
          "User roles & permissions",
          "Lifetime access",
        ];
      default:
        return [
          "AI Super Resolution",
          "Basic enhancements",
          "Standard support",
        ];
    }
  };

  // Get next tier info for upgrade section
  const getNextTierInfo = () => {
    if (effectiveTier === "free") {
      return {
        name: "Pro",
        price: billingYearly ? "$99" : "$9.99",
        period: billingYearly ? "/year" : "/month",
        description: "Unlock advanced features and scale your operations",
        features: [
          "All Starter features",
          "Up to 100 enhancements",
          "API access",
          "Presets",
          "Organise with folders",
          "Priority support",
        ],
      };
    } else if (effectiveTier === "pro") {
      return {
        name: "Lifetime",
        price: "$299",
        period: "/once",
        description: "One-time payment for lifetime access",
        features: [
          "All Pro features",
          "Up to 500 enhancements",
          "Workflows",
          "Company account",
          "User roles & permissions",
          "Lifetime access",
        ],
      };
    }
    return null;
  };

  const nextTierInfo = getNextTierInfo();

  // Get current plan price display
  const getCurrentPlanPrice = () => {
    if (originalTier === "free") return "Free";
    if (originalTier === "pro") {
      return billingYearly ? "$99" : "$9.99";
    }
    if (originalTier === "lifetime") return "$299";
    return "Free";
  };

  const getCurrentPlanPeriod = () => {
    if (originalTier === "free") return "";
    if (originalTier === "pro") {
      return billingYearly ? "/year" : "/month";
    }
    if (originalTier === "lifetime") return "/once";
    return "";
  };

  async function cancelProAtPeriodEnd() {
    try {
      setCancelLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ when: "period_end" }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Failed to cancel subscription");
      }

      // Refresh subscription data
      await loadSubscription();
      setError(null);
    } catch (e: unknown) {
      const msg =
        (e as Error)?.message ??
        "Failed to cancel subscription. Please try again.";
      setError(msg);
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 font-sans">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-2">
        <ProfileSectionHeader
          title="Subscriptions"
          description="Manage your subscription and explore upgrade options"
        />
        {loading ? (
          <div className="py-16 text-center">
            <div className="text-muted-foreground">
              Loading subscription data…
            </div>
          </div>
        ) : (
          <>
            {/* Current Plan Section */}
            <div className="mb-16">
              <div className="mb-8">
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
                  Current Plan
                </span>
                <h2 className="mb-2 font-bold text-4xl">
                  You&apos;re on the{" "}
                  <span className="text-red-500">
                    {getTierDisplayName(originalTier)}
                  </span>{" "}
                  Plan
                </h2>
                <p className="text-lg text-muted-foreground">
                  Manage your subscription and explore upgrade options
                </p>
              </div>

              {/* Current Plan Card */}
              <Card className="mb-8 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
                <div className="grid gap-12 xl:grid-cols-3">
                  {/* Left: Plan Info */}
                  <div>
                    <div className="mb-8">
                      <p className="mb-2 text-muted-foreground text-sm uppercase tracking-wide">
                        Current Plan
                      </p>
                      <h3 className="mb-2 font-bold text-5xl">
                        {getTierDisplayName(originalTier)}
                      </h3>
                      <div className="mb-4 flex items-baseline gap-1">
                        <span className="font-semibold text-3xl">
                          {getCurrentPlanPrice()}
                        </span>
                        <span className="text-muted-foreground">
                          {getCurrentPlanPeriod()}
                        </span>
                      </div>
                      <p className="mb-6 text-muted-foreground text-sm">
                        Valid until{" "}
                        <span className="font-semibold text-foreground">
                          {getValidUntilText()}
                        </span>
                      </p>
                      {status === "canceling" && validUntil && (
                        <p className="mb-4 text-orange-600 text-sm">
                          Your subscription will end on {getValidUntilText()}.
                        </p>
                      )}
                      {error && (
                        <p className="mb-4 text-red-600 text-sm">{error}</p>
                      )}
                      <div className="flex flex-col gap-3 xl:flex-row">
                        {originalTier === "pro" && status !== "canceling" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="gap-2"
                                disabled={cancelLoading}
                              >
                                {cancelLoading ? "Canceling..." : "Cancel Plan"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Subscription?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Your subscription will remain active until the
                                  end of your current billing period (
                                  {getValidUntilText()}). You&apos;ll continue
                                  to have access to Pro features until then.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Subscription
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={cancelProAtPeriodEnd}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Cancel at Period End
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Features Grid */}
                  <div className="xl:col-span-2">
                    <p className="mb-6 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                      What&apos;s Included
                    </p>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {getCurrentPlanFeatures().map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-primary" />
                          <span className="text-foreground text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats Cards - Only show for Pro tier */}
              {originalTier === "pro" && (
                <div className="grid gap-4 xl:grid-cols-3">
                  <Card className="border border-border/60 bg-card/50 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="mb-1 text-muted-foreground text-sm">
                          Billing Cycle
                        </p>
                        <p className="font-bold text-2xl">
                          {billingYearly ? "Yearly" : "Monthly"}
                        </p>
                      </div>
                      <Zap className="size-5 text-primary/60" />
                    </div>
                  </Card>

                  <Card className="border border-border/60 bg-card/50 p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="mb-1 text-muted-foreground text-sm">
                          Status
                        </p>
                        <p className="font-bold text-2xl capitalize">
                          {status === "canceling" ? "Canceling" : "Active"}
                        </p>
                      </div>
                      <Users className="size-5 text-primary/60" />
                    </div>
                  </Card>

                  <Card className="border border-border/60 bg-card/50 p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="mb-1 text-muted-foreground text-sm">
                          Plan Type
                        </p>
                        <p className="font-bold text-2xl">Pro</p>
                      </div>
                      <Lock className="size-5 text-primary/60" />
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Upgrade Section - Only show if not lifetime */}
            {effectiveTier !== "lifetime" && nextTierInfo && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="mb-2 font-bold text-3xl">Ready for more?</h2>
                  <p className="text-muted-foreground">
                    Unlock advanced features and scale your operations
                  </p>
                </div>

                {/* Upgrade Card */}
                <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-8">
                  <div className="absolute top-0 right-0 -z-10 size-64 rounded-full bg-primary/5 blur-3xl" />

                  <div className="grid gap-12 xl:grid-cols-3">
                    {/* Left: Plan Info */}
                    <div>
                      <div className="mb-4 inline-block rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs">
                        {effectiveTier === "free" ? "Most Popular" : "Upgrade"}
                      </div>
                      <h3 className="mb-2 font-bold text-4xl">
                        {nextTierInfo.name}
                      </h3>
                      <div className="mb-2 flex items-baseline gap-1">
                        <span className="font-semibold text-3xl">
                          {nextTierInfo.price}
                        </span>
                        <span className="text-muted-foreground">
                          {nextTierInfo.period}
                        </span>
                      </div>
                      <p className="mb-6 text-muted-foreground text-sm">
                        {nextTierInfo.description}
                      </p>
                      <Button
                        size="lg"
                        className="group w-full gap-2"
                        onClick={() => {
                          const nextTier = getNextTier();
                          if (nextTier === "pro") {
                            handleCheckout(
                              "pro",
                              billingYearly ? "year" : "month",
                            );
                          } else {
                            handleCheckout("lifetime");
                          }
                        }}
                        disabled={checkoutLoading !== null}
                      >
                        {checkoutLoading ? "Loading..." : "Upgrade Now"}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>

                    {/* Right: Features */}
                    <div className="xl:col-span-2">
                      <p className="mb-6 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                        {nextTierInfo.name} Benefits
                      </p>
                      <div className="grid gap-4 xl:grid-cols-2">
                        {nextTierInfo.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-primary" />
                            <span className="text-foreground text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* FAQ Section */}
            <div className="max-w-3xl">
              <h2 className="mb-8 font-bold text-2xl">Common Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Can I change plans anytime?",
                    a: "Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
                  },
                  {
                    q: "What happens to my data if I cancel?",
                    a: "Your data remains safe. You can access and export it for 30 days after cancellation.",
                  },
                  {
                    q: "Do you offer annual billing?",
                    a: "Yes! Annual plans include a 10% discount. You can switch between monthly and yearly billing at any time.",
                  },
                ].map((faq) => (
                  <Card
                    key={faq.q}
                    className="border border-border/60 p-6 transition-colors hover:border-primary/40"
                  >
                    <h3 className="mb-2 font-semibold">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
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

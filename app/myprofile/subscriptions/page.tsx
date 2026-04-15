"use client";

import { useEffect, useMemo, useState } from "react";
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

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function SubscriptionsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { ready: authReady } = useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    if (searchParams?.get("canceled") === "1") {
      setError(
        "Checkout was canceled. Please try again if you'd like to upgrade."
      );
      // Remove the parameter from URL
      router.replace("/myprofile/subscriptions", { scroll: false });
    }
  }, [searchParams, router]);

  async function handleCheckout(
    tier: "pro" | "lifetime",
    cycle?: "month" | "year"
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
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2">
        {loading ? (
          <div className="text-center py-16">
            <div className="text-muted-foreground">
              Loading subscription data…
            </div>
          </div>
        ) : (
          <>
            {/* Current Plan Section */}
            <div className="mb-16">
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Current Plan
                </span>
                <h2 className="text-4xl font-bold mb-2">
                  You&apos;re on the{" "}
                  <span className="text-red-500">
                    {getTierDisplayName(originalTier)}
                  </span>{" "}
                  Plan
                </h2>
                <p className="text-muted-foreground text-lg">
                  Manage your subscription and explore upgrade options
                </p>
              </div>

              {/* Current Plan Card */}
              <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 mb-8">
                <div className="grid md:grid-cols-3 gap-12">
                  {/* Left: Plan Info */}
                  <div>
                    <div className="mb-8">
                      <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">
                        Current Plan
                      </p>
                      <h3 className="text-5xl font-bold mb-2">
                        {getTierDisplayName(originalTier)}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-semibold">
                          {getCurrentPlanPrice()}
                        </span>
                        <span className="text-muted-foreground">
                          {getCurrentPlanPeriod()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        Valid until{" "}
                        <span className="font-semibold text-foreground">
                          {getValidUntilText()}
                        </span>
                      </p>
                      {status === "canceling" && validUntil && (
                        <p className="text-sm text-orange-600 mb-4">
                          Your subscription will end on {getValidUntilText()}.
                        </p>
                      )}
                      {error && (
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                      )}
                      <div className="flex gap-3 flex-col sm:flex-row">
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
                                  {getValidUntilText()}). You&apos;ll continue to
                                  have access to Pro features until then.
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
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
                      What&apos;s Included
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {getCurrentPlanFeatures().map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
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
                <div className="grid sm:grid-cols-3 gap-4">
                  <Card className="p-6 border border-border/60 bg-card/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Billing Cycle
                        </p>
                        <p className="text-2xl font-bold">
                          {billingYearly ? "Yearly" : "Monthly"}
                        </p>
                      </div>
                      <Zap className="w-5 h-5 text-primary/60" />
                    </div>
                  </Card>

                  <Card className="p-6 border border-border/60 bg-card/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Status
                        </p>
                        <p className="text-2xl font-bold capitalize">
                          {status === "canceling" ? "Canceling" : "Active"}
                        </p>
                      </div>
                      <Users className="w-5 h-5 text-primary/60" />
                    </div>
                  </Card>

                  <Card className="p-6 border border-border/60 bg-card/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Plan Type
                        </p>
                        <p className="text-2xl font-bold">Pro</p>
                      </div>
                      <Lock className="w-5 h-5 text-primary/60" />
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Upgrade Section - Only show if not lifetime */}
            {effectiveTier !== "lifetime" && nextTierInfo && (
              <div className="mb-16">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Ready for more?</h2>
                  <p className="text-muted-foreground">
                    Unlock advanced features and scale your operations
                  </p>
                </div>

                {/* Upgrade Card */}
                <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

                  <div className="grid md:grid-cols-3 gap-12">
                    {/* Left: Plan Info */}
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-4">
                        {effectiveTier === "free" ? "Most Popular" : "Upgrade"}
                      </div>
                      <h3 className="text-4xl font-bold mb-2">
                        {nextTierInfo.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-semibold">
                          {nextTierInfo.price}
                        </span>
                        <span className="text-muted-foreground">
                          {nextTierInfo.period}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-6 text-sm">
                        {nextTierInfo.description}
                      </p>
                      <Button
                        size="lg"
                        className="w-full gap-2 group"
                        onClick={() => {
                          const nextTier = getNextTier();
                          if (nextTier === "pro") {
                            handleCheckout(
                              "pro",
                              billingYearly ? "year" : "month"
                            );
                          } else {
                            handleCheckout("lifetime");
                          }
                        }}
                        disabled={checkoutLoading !== null}
                      >
                        {checkoutLoading ? "Loading..." : "Upgrade Now"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Right: Features */}
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
                        {nextTierInfo.name} Benefits
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {nextTierInfo.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">
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
              <h2 className="text-2xl font-bold mb-8">Common Questions</h2>
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
                ].map((faq, idx) => (
                  <Card
                    key={idx}
                    className="p-6 border border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
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

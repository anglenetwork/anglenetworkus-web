import type { Tier } from "@/lib/subscriptions/tier";
import { getTierDisplayName } from "@/lib/subscriptions/pricing-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { CheckCircle2, Zap, Users, Lock } from "lucide-react";
import {
  profileFormError,
  profileSubscriptionEyebrow,
  profileSubscriptionFeatureLabel,
  profileSubscriptionFeatureText,
  profileSubscriptionHeroSubtitle,
  profileSubscriptionHeroTitle,
  profileSubscriptionHeroTitleAccent,
  profileSubscriptionMetaLabel,
  profileSubscriptionMetaValue,
  profileSubscriptionPlanPrice,
  profileSubscriptionPriceAmount,
  profileSubscriptionPricePeriod,
  profileSubscriptionStatLabel,
  profileSubscriptionStatValue,
  profileSubscriptionWarning,
} from "@/app/lib/typography/myprofile-page";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function getCurrentPlanFeatures(originalTier: Tier): string[] {
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
      return ["AI Super Resolution", "Basic enhancements", "Standard support"];
  }
}

function getCurrentPlanPrice(originalTier: Tier, billingYearly: boolean) {
  if (originalTier === "free") return "Free";
  if (originalTier === "pro") return billingYearly ? "$99" : "$9.99";
  if (originalTier === "lifetime") return "$299";
  return "Free";
}

function getCurrentPlanPeriod(originalTier: Tier, billingYearly: boolean) {
  if (originalTier === "free") return "";
  if (originalTier === "pro") return billingYearly ? "/year" : "/month";
  if (originalTier === "lifetime") return "/once";
  return "";
}

type SubscriptionsCurrentPlanProps = {
  originalTier: Tier;
  billingYearly: boolean;
  validUntil: string | null;
  status: string | null;
  error: string | null;
  cancelLoading: boolean;
  onCancel: () => void;
};

export function SubscriptionsCurrentPlan({
  originalTier,
  billingYearly,
  validUntil,
  status,
  error,
  cancelLoading,
  onCancel,
}: SubscriptionsCurrentPlanProps) {
  const validUntilText = validUntil ? formatDate(validUntil) : "Forever";

  return (
    <div className="mb-16">
      <div className="mb-8">
        <span className={profileSubscriptionEyebrow}>Current Plan</span>
        <h2 className={profileSubscriptionHeroTitle}>
          You&apos;re on the{" "}
          <span className={profileSubscriptionHeroTitleAccent}>
            {getTierDisplayName(originalTier)}
          </span>{" "}
          Plan
        </h2>
        <p className={profileSubscriptionHeroSubtitle}>
          Manage your subscription and explore upgrade options
        </p>
      </div>

      <Card className="mb-8 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
        <div className="grid gap-12 xl:grid-cols-3">
          <div>
            <div className="mb-8">
              <p className={profileSubscriptionMetaLabel}>Current Plan</p>
              <h3 className={profileSubscriptionPlanPrice}>
                {getTierDisplayName(originalTier)}
              </h3>
              <div className="mb-4 flex items-baseline gap-1">
                <span className={profileSubscriptionPriceAmount}>
                  {getCurrentPlanPrice(originalTier, billingYearly)}
                </span>
                <span className={profileSubscriptionPricePeriod}>
                  {getCurrentPlanPeriod(originalTier, billingYearly)}
                </span>
              </div>
              <p className="mb-6 font-sans text-neutral-400 text-sm">
                Valid until{" "}
                <span className={profileSubscriptionMetaValue}>
                  {validUntilText}
                </span>
              </p>
              {status === "canceling" && validUntil && (
                <p className={profileSubscriptionWarning}>
                  Your subscription will end on {validUntilText}.
                </p>
              )}
              {error && <p className={profileFormError}>{error}</p>}
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
                          Your subscription will remain active until the end of
                          your current billing period ({validUntilText}).
                          You&apos;ll continue to have access to Pro features
                          until then.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onCancel}
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

          <div className="xl:col-span-2">
            <p className={profileSubscriptionFeatureLabel}>
              What&apos;s Included
            </p>
            <div className="grid gap-4 xl:grid-cols-2">
              {getCurrentPlanFeatures(originalTier).map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 flex-shrink-0 text-primary" />
                  <span className={profileSubscriptionFeatureText}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {originalTier === "pro" && (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="border border-border/60 bg-card/50 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className={profileSubscriptionStatLabel}>Billing Cycle</p>
                <p className={profileSubscriptionStatValue}>
                  {billingYearly ? "Yearly" : "Monthly"}
                </p>
              </div>
              <Zap className="size-5 text-primary/60" />
            </div>
          </Card>

          <Card className="border border-border/60 bg-card/50 p-6">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className={profileSubscriptionStatLabel}>Status</p>
                <p className={profileSubscriptionStatValue}>
                  {status === "canceling" ? "Canceling" : "Active"}
                </p>
              </div>
              <Users className="size-5 text-primary/60" />
            </div>
          </Card>

          <Card className="border border-border/60 bg-card/50 p-6">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className={profileSubscriptionStatLabel}>Plan Type</p>
                <p className={profileSubscriptionStatValue}>Pro</p>
              </div>
              <Lock className="size-5 text-primary/60" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

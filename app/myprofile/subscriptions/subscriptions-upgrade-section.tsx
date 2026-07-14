import type { Tier } from "@/lib/subscriptions/tier";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getNextTierInfo } from "./subscriptions-upgrade-helpers";
import {
  profileSubscriptionBadge,
  profileSubscriptionFeatureLabel,
  profileSubscriptionFeatureText,
  profileSubscriptionHeroTitle,
  profileSubscriptionPriceAmount,
  profileSubscriptionPricePeriod,
  profileSubscriptionSectionSubtitle,
  profileSubscriptionSectionTitle,
} from "@/app/lib/typography/myprofile-page";

type SubscriptionsUpgradeSectionProps = {
  effectiveTier: Tier;
  billingYearly: boolean;
  checkoutLoading: string | null;
  onUpgrade: () => void;
};

export function SubscriptionsUpgradeSection({
  effectiveTier,
  billingYearly,
  checkoutLoading,
  onUpgrade,
}: SubscriptionsUpgradeSectionProps) {
  const nextTierInfo = getNextTierInfo(effectiveTier, billingYearly);

  if (effectiveTier === "lifetime" || !nextTierInfo) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 className={profileSubscriptionSectionTitle}>Ready for more?</h2>
        <p className={profileSubscriptionSectionSubtitle}>
          Unlock advanced features and scale your operations
        </p>
      </div>

      <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-transparent p-8">
        <div className="absolute top-0 right-0 -z-10 size-64 rounded-full bg-primary/5 blur-3xl" />

        <div className="grid gap-12 xl:grid-cols-3">
          <div>
            <div className={profileSubscriptionBadge}>
              {effectiveTier === "free" ? "Most Popular" : "Upgrade"}
            </div>
            <h3 className={profileSubscriptionHeroTitle}>
              {nextTierInfo.name}
            </h3>
            <div className="mb-2 flex items-baseline gap-1">
              <span className={profileSubscriptionPriceAmount}>
                {nextTierInfo.price}
              </span>
              <span className={profileSubscriptionPricePeriod}>
                {nextTierInfo.period}
              </span>
            </div>
            <p className="mb-6 font-sans text-news-muted text-sm">
              {nextTierInfo.description}
            </p>
            <Button
              size="lg"
              className="group w-full gap-2"
              onClick={onUpgrade}
              disabled={checkoutLoading !== null}
            >
              {checkoutLoading ? "Loading..." : "Upgrade Now"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="xl:col-span-2">
            <p className={profileSubscriptionFeatureLabel}>
              {nextTierInfo.name} Benefits
            </p>
            <div className="grid gap-4 xl:grid-cols-2">
              {nextTierInfo.features.map((feature) => (
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
    </div>
  );
}

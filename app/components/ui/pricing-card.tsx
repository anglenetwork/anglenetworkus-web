import type React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resolvePricingCardStyles } from "./pricing-card-styles";
import PricingCardPriceBlock from "./pricing-card-price-block";

interface PricingCardProps {
  plan: string;
  price: number | null;
  pricingLabel?: string | null;
  recommended?: boolean;
  periodLabel?: string;
  features: string[];
  buttonText?: string;
  buttonVariant?: string;
  disabled?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  discountText?: string;
  onClick?: () => void | Promise<void>;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  price,
  pricingLabel,
  recommended = false,
  periodLabel,
  features,
  buttonText,
  buttonVariant = "default",
  disabled = false,
  borderColor,
  backgroundColor,
  discountText,
  onClick,
}) => {
  const {
    cardClass,
    textClass,
    secondaryTextClass,
    buttonClass,
    hasCustomBackground,
    accent,
  } = resolvePricingCardStyles({
    recommended,
    backgroundColor,
    borderColor,
    buttonVariant,
  });

  return (
    <Card
      className={`flex w-full min-w-0 flex-col rounded-2xl p-8 font-sans lg:flex-1 ${cardClass} ${textClass}`}
    >
      {/* Header */}
      <div className="mb-6">
        {(recommended || hasCustomBackground) && (
          <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 font-semibold text-sm text-white">
            RECOMMENDED
          </div>
        )}
        <h3 className="mb-2 font-bold text-3xl">{plan}</h3>

        {/* Pricing */}
        <div>
          <PricingCardPriceBlock
            price={price}
            pricingLabel={pricingLabel}
            periodLabel={periodLabel}
            discountText={discountText}
            secondaryTextClass={secondaryTextClass}
            accent={accent}
          />
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <Check
              className={`size-5 flex-shrink-0 ${accent ? "text-news-primary-soft" : "text-emerald-600"} mt-0.5`}
            />
            <span className={`text-base ${secondaryTextClass}`}>{feature}</span>
          </div>
        ))}
      </div>

      {buttonText && (
        <Button
          className={`mt-8 w-full rounded-full py-3 font-semibold transition-all ${buttonClass}`}
          disabled={disabled}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      )}
    </Card>
  );
};

export default PricingCard;

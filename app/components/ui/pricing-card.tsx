import type React from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const hasCustomBackground = !!backgroundColor;
  const cardClass = backgroundColor
    ? `${backgroundColor} border-0`
    : recommended
      ? "bg-emerald-500 border-0"
      : borderColor
        ? `bg-gray-50 border-2 ${borderColor}`
        : "bg-gray-50 border border-gray-200";

  const textClass =
    hasCustomBackground || recommended ? "text-white" : "text-gray-900";
  const secondaryTextClass =
    hasCustomBackground || recommended ? "text-red-100" : "text-gray-600";

  const getButtonClass = () => {
    if (buttonVariant === "current") {
      return "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50";
    }
    if (hasCustomBackground || recommended) {
      return "bg-white text-red-600 hover:bg-gray-50 border-0";
    }
    return "bg-gray-200 text-gray-900 hover:bg-gray-300 border-0";
  };

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
          {price !== null && (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-6xl">${price}</span>
                {periodLabel && (
                  <span
                    className={`text-xl opacity-90 ${secondaryTextClass} inline-block min-w-[85px]`}
                  >
                    {periodLabel}
                  </span>
                )}
              </div>
              {discountText && (
                <div
                  className={`mt-1 font-semibold text-2xl ${hasCustomBackground || recommended ? "text-red-200" : "text-emerald-600"}`}
                >
                  {discountText}
                </div>
              )}
            </div>
          )}
          {pricingLabel && (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-6xl">{pricingLabel}</span>
                {periodLabel && (
                  <span
                    className={`text-xl opacity-90 ${secondaryTextClass} inline-block min-w-[85px]`}
                  >
                    {periodLabel}
                  </span>
                )}
              </div>
              {discountText && (
                <div
                  className={`mt-1 font-semibold text-sm ${hasCustomBackground || recommended ? "text-red-200" : "text-emerald-600"}`}
                >
                  {discountText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <Check
              className={`size-5 flex-shrink-0 ${hasCustomBackground || recommended ? "text-red-200" : "text-emerald-600"} mt-0.5`}
            />
            <span className={`text-base ${secondaryTextClass}`}>{feature}</span>
          </div>
        ))}
      </div>

      {buttonText && (
        <Button
          className={`mt-8 w-full rounded-full py-3 font-semibold transition-all ${getButtonClass()}`}
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

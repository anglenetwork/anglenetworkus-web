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
  discountText,
  onClick,
}) => {
  const cardClass = recommended
    ? "bg-emerald-500 border-0"
    : borderColor
      ? `bg-gray-50 border-2 ${borderColor}`
      : "bg-gray-50 border border-gray-200";

  const textClass = recommended ? "text-white" : "text-gray-900";
  const secondaryTextClass = recommended ? "text-emerald-100" : "text-gray-600";

  const getButtonClass = () => {
    if (buttonVariant === "current") {
      return "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50";
    }
    if (recommended) {
      return "bg-white text-emerald-600 hover:bg-gray-50 border-0";
    }
    return "bg-gray-200 text-gray-900 hover:bg-gray-300 border-0";
  };

  return (
    <Card
      className={`font-sans flex-1 rounded-2xl p-8 flex flex-col min-w-0 ${cardClass} ${textClass}`}
    >
      {/* Header */}
      <div className="mb-6">
        {recommended && (
          <div className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
            RECOMMENDED
          </div>
        )}
        <h3 className="text-3xl font-bold mb-2">{plan}</h3>

        {/* Pricing */}
        <div>
          {price !== null && (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">${price}</span>
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
                  className={`text-2xl font-semibold mt-1 ${recommended ? "text-emerald-200" : "text-emerald-600"}`}
                >
                  {discountText}
                </div>
              )}
            </div>
          )}
          {pricingLabel && (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">{pricingLabel}</span>
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
                  className={`text-sm font-semibold mt-1 ${recommended ? "text-emerald-200" : "text-emerald-600"}`}
                >
                  {discountText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 flex-1">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 flex-shrink-0 ${recommended ? "text-emerald-200" : "text-emerald-600"} mt-0.5`}
            />
            <span className={`text-base ${secondaryTextClass}`}>{feature}</span>
          </div>
        ))}
      </div>

      {buttonText && (
        <Button
          className={`w-full py-3 rounded-full font-semibold mt-8 transition-all ${getButtonClass()}`}
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

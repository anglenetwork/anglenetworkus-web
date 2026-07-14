function PricingCardPriceBlock({
  price,
  pricingLabel,
  periodLabel,
  discountText,
  secondaryTextClass,
  accent,
}: {
  price: number | null;
  pricingLabel?: string | null;
  periodLabel?: string;
  discountText?: string;
  secondaryTextClass: string;
  accent: boolean;
}) {
  const discountClass = accent ? "text-news-primary-soft" : "text-emerald-600";

  if (price !== null) {
    return (
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
          <div className={`mt-1 font-semibold text-2xl ${discountClass}`}>
            {discountText}
          </div>
        )}
      </div>
    );
  }

  if (pricingLabel) {
    return (
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
          <div className={`mt-1 font-semibold text-sm ${discountClass}`}>
            {discountText}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default PricingCardPriceBlock;

export function resolvePricingCardStyles({
  recommended = false,
  backgroundColor,
  borderColor,
  buttonVariant = "default",
}: {
  recommended?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  buttonVariant?: string;
}) {
  const hasCustomBackground = !!backgroundColor;
  const cardClass = backgroundColor
    ? `${backgroundColor} border-0`
    : recommended
      ? "bg-emerald-500 border-0"
      : borderColor
        ? `bg-news-surface border-2 ${borderColor}`
        : "bg-news-surface border border-news-border";

  const textClass =
    hasCustomBackground || recommended ? "text-white" : "text-news-text";
  const secondaryTextClass =
    hasCustomBackground || recommended
      ? "text-news-primary-soft"
      : "text-news-muted";

  let buttonClass: string;
  if (buttonVariant === "current") {
    buttonClass =
      "border border-news-border bg-white text-news-text hover:bg-news-surface";
  } else if (hasCustomBackground || recommended) {
    buttonClass = "bg-white text-news-primary hover:bg-news-surface border-0";
  } else {
    buttonClass = "bg-news-border text-news-text hover:bg-news-border border-0";
  }

  return {
    cardClass,
    textClass,
    secondaryTextClass,
    buttonClass,
    hasCustomBackground,
    accent: hasCustomBackground || recommended,
  };
}

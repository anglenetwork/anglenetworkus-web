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
        ? `bg-gray-50 border-2 ${borderColor}`
        : "bg-gray-50 border border-gray-200";

  const textClass =
    hasCustomBackground || recommended ? "text-white" : "text-gray-900";
  const secondaryTextClass =
    hasCustomBackground || recommended ? "text-red-100" : "text-gray-600";

  let buttonClass: string;
  if (buttonVariant === "current") {
    buttonClass =
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50";
  } else if (hasCustomBackground || recommended) {
    buttonClass = "bg-white text-red-600 hover:bg-gray-50 border-0";
  } else {
    buttonClass = "bg-gray-200 text-gray-900 hover:bg-gray-300 border-0";
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

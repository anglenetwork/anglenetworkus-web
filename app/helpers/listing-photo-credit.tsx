import { formatImageCredit } from "@/sanity/lib/utils";
import { ExcerptCreditCaption } from "./excerpt-credit-caption";

type ListingPhotoCreditProps = {
  cover?: unknown;
  className?: string;
  align?: "left" | "right";
};

export function ListingPhotoCredit({
  cover,
  className,
  align = "right",
}: ListingPhotoCreditProps) {
  const credit = formatImageCredit(cover);
  return (
    <ExcerptCreditCaption
      credit={credit}
      className={className}
      align={align}
      variant="compact"
    />
  );
}

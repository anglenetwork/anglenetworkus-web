import { cn } from "@/lib/utils";

/** Shared 3→2→1 column grid shell for More Sections and Trending strip. */
export function sectionGridClassName(options?: {
  withTopBorder?: boolean;
  className?: string;
}) {
  const { withTopBorder = true, className } = options ?? {};
  return cn(
    "grid grid-cols-3",
    withTopBorder && "border-angle-ink border-t",
    "max-[1000px]:grid-cols-2 max-[1000px]:gap-x-8",
    "max-[640px]:grid-cols-1 max-[640px]:gap-x-0",
    className,
  );
}

/** Lead image wrapper — rectangle aspect; xl equal-width via parent cell selectors. */
export function sectionLeadImageClassName(
  aspect: "4/3" | "16/11" | "3/4" = "4/3",
  className?: string,
) {
  return cn(
    "sec-lead-img relative w-full overflow-hidden bg-angle-paper",
    aspect === "4/3"
      ? "aspect-[4/3]"
      : aspect === "16/11"
        ? "aspect-[16/11]"
        : "aspect-[3/4]",
    className,
  );
}

/** At xl, center cells have pl+pr gutter; edge cells drop one side — trim lead img to match. */
export const xlLeadImageEdgeWidth =
  "xl:[&:first-child_.sec-lead-img]:w-[calc(100%-2rem)] xl:[&:last-child_.sec-lead-img]:w-[calc(100%-2rem)]";

export const xlLeadImageFirstEdgeWidth =
  "xl:[&:first-child_.sec-lead-img]:w-[calc(100%-2rem)]";

/** Text-only trending strip cells — borders only; vertical rhythm from section padding. */
export function sectionTrendingCellClassName(className?: string) {
  return cn(
    "block min-w-0 not-first:border-angle-hairline not-first:border-l pr-8 pl-8 first:pl-0 last:pr-0",
    "max-[1000px]:border-angle-hairline max-[1000px]:not-first:border-t max-[1000px]:border-l-0 max-[1000px]:first:border-t-0 max-[1000px]:[&:nth-child(2)]:border-t-0",
    "max-[1000px]:px-0",
    "max-[640px]:border-angle-hairline max-[640px]:border-t max-[640px]:px-0 max-[640px]:py-4 max-[640px]:first:border-t-0 max-[640px]:[&:nth-child(2)]:border-t",
    className,
  );
}

/** Per-cell borders and padding matching the Angle section mock. */
export function sectionGridCellClassName(className?: string) {
  return cn(
    "min-w-0 not-first:border-angle-hairline not-first:border-l py-[30px] pr-10 pl-10 first:pl-0 last:pr-0",
    "xl:pr-8 xl:pl-8 xl:last:pr-0 xl:first:pl-0",
    xlLeadImageEdgeWidth,
    "max-[1000px]:border-angle-hairline max-[1000px]:not-first:border-t max-[1000px]:border-l-0 max-[1000px]:py-6 max-[1000px]:first:border-t-0 max-[1000px]:[&:nth-child(2)]:border-t-0",
    "max-[1000px]:px-0",
    "max-[640px]:border-angle-hairline max-[640px]:border-t max-[640px]:px-0 max-[640px]:first:border-t-0 max-[640px]:[&:nth-child(2)]:border-t",
    className,
  );
}

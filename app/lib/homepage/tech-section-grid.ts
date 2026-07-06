import { cn } from "@/lib/utils";
import { xlLeadImageFirstEdgeWidth } from "@/app/lib/homepage/section-grid-cells";

/** Tech module 3→2→1 column grid with strong top rule. */
export function techGridClassName(className?: string) {
  return cn(
    "grid grid-cols-3 border-angle-ink border-t",
    "max-[1100px]:grid-cols-2 max-[1100px]:gap-x-8",
    "max-[720px]:grid-cols-1 max-[720px]:gap-x-0",
    className,
  );
}

/** Editorial tech column (cols 1–2). */
export function techEditorialColumnClassName(className?: string) {
  return cn(
    "min-w-0 not-first:border-angle-hairline not-first:border-l py-8 pr-10 pl-10 first:pl-0 last:pr-0",
    "xl:pr-8 xl:pl-8 xl:first:pl-0",
    xlLeadImageFirstEdgeWidth,
    "max-[1100px]:border-angle-hairline max-[1100px]:not-first:border-t max-[1100px]:border-l-0 max-[1100px]:py-8 max-[1100px]:first:border-t-0 max-[1100px]:[&:nth-child(2)]:border-t-0",
    "max-[1100px]:px-0",
    "max-[720px]:border-angle-hairline max-[720px]:border-t max-[720px]:px-0 max-[720px]:py-8 max-[720px]:first:border-t-0 max-[720px]:[&:nth-child(2)]:border-t",
    className,
  );
}

/** Most Read column (col 3) — spans full width below editorial cols at ≤1100px. */
export function techMostReadColumnClassName(className?: string) {
  return cn(
    "min-w-0 border-angle-hairline not-first:border-l py-8 pr-10 pl-10 first:pl-0 last:pr-0 xl:pr-0 xl:pl-8",
    "max-[1100px]:col-span-full max-[1100px]:mt-8 max-[1100px]:border-angle-ink max-[1100px]:border-t max-[1100px]:border-l-0 max-[1100px]:pt-8 max-[1100px]:pr-0 max-[1100px]:pl-0",
    "max-[720px]:mt-0 max-[720px]:border-angle-hairline max-[720px]:border-t max-[720px]:px-0 max-[720px]:py-8",
    className,
  );
}

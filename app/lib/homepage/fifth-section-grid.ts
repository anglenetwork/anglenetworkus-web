import { cn } from "@/lib/utils";

/** Fifth section 2-column grid: featured World + Politics list. */
export function fifthSectionGridClassName(className?: string) {
  return cn(
    "grid grid-cols-1 border-angle-ink border-t lg:grid-cols-[1.485fr_1fr]",
    className,
  );
}

/** Left featured column (World). */
export function fifthFeaturedColumnClassName(className?: string) {
  return cn(
    "min-w-0 py-8 pr-10 pl-0",
    "max-[1000px]:border-angle-hairline max-[1000px]:border-b max-[1000px]:py-8 max-[1000px]:pr-0",
    "max-[640px]:py-6",
    className,
  );
}

/** Right list column (Politics). */
export function fifthListColumnClassName(className?: string) {
  return cn(
    "min-w-0 border-angle-hairline py-8 pr-0 pl-10 lg:border-l",
    "max-[1000px]:border-l-0 max-[1000px]:py-8 max-[1000px]:pl-0",
    "max-[640px]:py-6",
    className,
  );
}

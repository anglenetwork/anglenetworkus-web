import { cn } from "@/lib/utils";
import {
  sectionGridCellClassName,
  sectionGridClassName,
} from "@/app/lib/homepage/section-grid-cells";

function skeletonBar(className?: string) {
  return cn("rounded-sm bg-news-border", className);
}

function CategoryColumnSkeleton() {
  return (
    <article className={sectionGridCellClassName()}>
      <div className="mb-[22px] flex items-center gap-2">
        <div className={skeletonBar("size-[7px] rounded-full")} />
        <div className={skeletonBar("h-3 w-20")} />
      </div>

      <div className={cn(skeletonBar(), "aspect-[4/3] w-full")} />
      <div className={skeletonBar("mt-2.5 h-2.5 w-32")} />

      <div className="mt-4 space-y-2">
        <div className={skeletonBar("h-5 w-full")} />
        <div className={skeletonBar("h-5 w-[85%]")} />
      </div>
      <div className={skeletonBar("mt-2 h-3 w-14")} />

      <div className="divider-dashed mt-[26px] flex items-start justify-between gap-4 pt-[22px]">
        <div className="min-w-0 flex-1 space-y-2">
          <div className={skeletonBar("h-4 w-full")} />
          <div className={skeletonBar("h-3 w-12")} />
        </div>
        <div className={skeletonBar("size-16 shrink-0")} />
      </div>
    </article>
  );
}

/** Gray skeleton mimicking the second-section 3-column category layout. */
export function SecondSectionSkeleton() {
  return (
    <section className="animate-pulse" aria-hidden aria-busy="true">
      <div className="mb-9 flex items-baseline gap-[18px]">
        <div className={skeletonBar("h-6 w-36")} />
        <div className="h-px flex-1 bg-news-border" />
      </div>
      <div className={sectionGridClassName()}>
        <CategoryColumnSkeleton />
        <CategoryColumnSkeleton />
        <CategoryColumnSkeleton />
      </div>
    </section>
  );
}

/** @deprecated Use {@link SecondSectionSkeleton}. */
export const BelowFoldSectionPlaceholder = SecondSectionSkeleton;

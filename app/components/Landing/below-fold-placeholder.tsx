import { cn } from "@/lib/utils";

function skeletonBar(className?: string) {
  return cn("rounded-sm bg-stone-200", className);
}

function CategoryColumnSkeleton() {
  return (
    <article className="space-y-4 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0">
      <div className="flex items-center gap-2">
        <div className={skeletonBar("h-3.5 w-3.5")} />
        <div className={skeletonBar("h-4 w-28")} />
      </div>

      <div className={cn(skeletonBar(), "aspect-[16/9] w-full")} />

      <div className="space-y-2">
        <div className={skeletonBar("h-5 w-full")} />
        <div className={skeletonBar("h-5 w-[85%]")} />
      </div>
      <div className={skeletonBar("h-3 w-14")} />

      <hr className="border-news-border border-t border-dotted" />

      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className={skeletonBar("h-4 w-full")} />
          <div className={skeletonBar("h-3 w-12")} />
        </div>
        <div className={skeletonBar("h-20 w-28 shrink-0")} />
      </div>
    </article>
  );
}

/** Gray skeleton mimicking the second-section 3-column category layout. */
export function SecondSectionSkeleton() {
  return (
    <main
      className="animate-pulse rounded-lg bg-news-surface"
      aria-hidden
      aria-busy="true"
    >
      <div className="grid grid-cols-1 divide-y divide-dotted divide-news-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        <CategoryColumnSkeleton />
        <CategoryColumnSkeleton />
        <CategoryColumnSkeleton />
      </div>
    </main>
  );
}

/** @deprecated Use {@link SecondSectionSkeleton}. */
export const BelowFoldSectionPlaceholder = SecondSectionSkeleton;

import { SecondSectionSkeleton } from "./below-fold-placeholder";
import { HOMEPAGE_BELOW_FOLD_SECTION_GAP } from "./homepage-below-fold-spacing";

/**
 * Server-safe fallback for the below-fold homepage Suspense boundary.
 */
export function HomepageBelowFoldFallback() {
  return (
    <div className={HOMEPAGE_BELOW_FOLD_SECTION_GAP}>
      <SecondSectionSkeleton />
    </div>
  );
}

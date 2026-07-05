import { BelowFoldSectionPlaceholder } from "./below-fold-placeholder";
import { HOMEPAGE_BELOW_FOLD_SECTION_GAP } from "./homepage-below-fold-spacing";

/**
 * Server-safe fallback for the below-fold homepage Suspense boundary.
 * Renders the same skeleton stack that the client-lazy loader uses.
 */
export function HomepageBelowFoldFallback() {
  return (
    <div className={HOMEPAGE_BELOW_FOLD_SECTION_GAP}>
      <BelowFoldSectionPlaceholder />
      <BelowFoldSectionPlaceholder />
      <BelowFoldSectionPlaceholder />
      <BelowFoldSectionPlaceholder />
      <BelowFoldSectionPlaceholder />
      <BelowFoldSectionPlaceholder />
    </div>
  );
}

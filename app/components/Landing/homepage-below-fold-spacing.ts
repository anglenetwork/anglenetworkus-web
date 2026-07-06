/**
 * Vertical rhythm for the homepage landing page.
 *
 * Major section gaps are owned by the parent `space-y-*` wrapper only — section
 * components must not add their own pt/pb for external separation (avoids
 * stacked 120px+ “island” gaps at xl).
 */
export const HOMEPAGE_BELOW_FOLD_SECTION_GAP = "space-y-10 xl:space-y-12";

/** Gap between visually paired blocks grouped in one wrapper (e.g. More Sections → Trending). */
export const HOMEPAGE_SECTION_PAIR_GAP = "max-lg:mt-6 lg:mt-10";

/** Horizontal inset inside SitePageWidth — shared by ThirdSection strip and mobile FirstSection feed. */
export const HOMEPAGE_LANDING_INSET_X = "px-6";

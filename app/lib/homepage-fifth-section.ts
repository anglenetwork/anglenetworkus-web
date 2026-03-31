/**
 * Single source of truth for homepage fifth section category columns.
 * Slugs must match Sanity `category.slug.current`.
 */
export const HOMEPAGE_FIFTH_SECTION_CATEGORIES = {
  left: { slug: "world", title: "World" },
  right: { slug: "politics", title: "Politics" },
} as const;

/** Max posts fetched per column (right layout uses up to ~11). */
export const HOMEPAGE_FIFTH_SECTION_FETCH_LIMIT = 21;

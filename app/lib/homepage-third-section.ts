/**
 * Single source of truth for homepage third section category columns.
 * Slugs must match Sanity `category.slug.current`.
 */
export const HOMEPAGE_THIRD_SECTION_CATEGORIES = {
  left: { slug: "world", title: "World" },
  right: { slug: "politics", title: "Politics" },
} as const;

/** Left column: 1 featured hero only. */
export const HOMEPAGE_THIRD_SECTION_LEFT_FETCH_LIMIT = 1;

/** Right column: small thumbnail rows. */
export const HOMEPAGE_THIRD_SECTION_RIGHT_FETCH_LIMIT = 4;

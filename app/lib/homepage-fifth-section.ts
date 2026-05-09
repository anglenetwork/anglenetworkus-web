/**
 * Single source of truth for homepage fifth section category columns.
 * Slugs must match Sanity `category.slug.current`.
 */
export const HOMEPAGE_FIFTH_SECTION_CATEGORIES = {
  left: { slug: "world", title: "World" },
  right: { slug: "politics", title: "Politics" },
} as const;

/** Left column: 1 hero + 2 secondary cards. */
export const HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT = 3;

/**
 * Right column: 2 featured-image slots + 4 headline-only links
 * (indices [0], [1–2], [3], [4–5]).
 */
export const HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT = 6;

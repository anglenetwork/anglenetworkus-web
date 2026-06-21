/**
 * Static nav fallbacks when Sanity category/tag queries return empty.
 * Slugs must stay aligned with news-ingestion canonical taxonomy.
 */

export const CANONICAL_NAV_CATEGORIES = [
  { slug: "us", name: "US" },
  { slug: "world", name: "World" },
  { slug: "politics", name: "Politics" },
  { slug: "business", name: "Business" },
  { slug: "science", name: "Science" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "tech", name: "Tech" },
  { slug: "lifestyle", name: "Lifestyle" },
] as const;

/** Representative canonical tags (mirrors top + shows tag nav slices). */
export const CANONICAL_NAV_TAGS = [
  { slug: "congress", title: "Congress" },
  { slug: "white-house", title: "White House" },
  { slug: "trump", title: "Trump" },
  { slug: "china", title: "China" },
  { slug: "artificial-intelligence", title: "Artificial Intelligence" },
  { slug: "immigration", title: "Immigration" },
  { slug: "markets", title: "Markets" },
  { slug: "climate", title: "Climate" },
  { slug: "movies", title: "Movies" },
  { slug: "health", title: "Health" },
  { slug: "elections", title: "Elections" },
] as const;

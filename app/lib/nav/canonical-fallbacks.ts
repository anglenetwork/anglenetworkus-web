/**
 * Static nav fallbacks when Sanity category/tag queries return empty.
 * Slugs must stay aligned with news-ingestion canonical taxonomy.
 */

export const CANONICAL_NAV_CATEGORIES = [
  { slug: "us", name: "US" },
  { slug: "world", name: "World" },
  { slug: "politics", name: "Politics" },
  { slug: "business", name: "Business" },
  { slug: "tech", name: "Tech" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "science", name: "Science" },
  { slug: "lifestyle", name: "Lifestyle" },
] as const;

export type CanonicalNavTag = { slug: string; title: string };

/** Category-scoped tags for full-screen menu fallbacks. */
export const CANONICAL_NAV_CATEGORY_TAGS: Record<string, CanonicalNavTag[]> = {
  us: [
    { slug: "trump", title: "Trump" },
    { slug: "iran-war", title: "Iran War" },
    { slug: "crime", title: "Crime" },
    { slug: "abortion", title: "Abortion" },
    { slug: "education", title: "Education" },
    { slug: "weather", title: "Weather" },
  ],
  world: [
    { slug: "china", title: "China" },
    { slug: "europe", title: "Europe" },
    { slug: "middle-east", title: "Middle East" },
    { slug: "latin-america", title: "Latin America" },
    { slug: "africa", title: "Africa" },
  ],
  politics: [
    { slug: "immigration", title: "Immigration" },
    { slug: "white-house", title: "White House" },
    { slug: "congress", title: "Congress" },
    { slug: "elections", title: "Elections" },
    { slug: "supreme-court", title: "Supreme Court" },
  ],
  business: [
    { slug: "markets", title: "Markets" },
    { slug: "economy", title: "Economy" },
    { slug: "finance", title: "Finance" },
    { slug: "tariffs", title: "Tariffs" },
    { slug: "inflation", title: "Inflation" },
    { slug: "real-estate", title: "Real Estate" },
  ],
  science: [
    { slug: "space", title: "Space" },
    { slug: "life-sciences", title: "Life Sciences" },
    { slug: "climate", title: "Climate" },
  ],
  entertainment: [
    { slug: "movies", title: "Movies" },
    { slug: "television", title: "Television" },
    { slug: "fashion", title: "Fashion" },
    { slug: "music", title: "Music" },
    { slug: "celebrity", title: "Celebrity" },
  ],
  tech: [
    { slug: "artificial-intelligence", title: "Artificial Intelligence" },
    { slug: "social-media", title: "Social Media" },
  ],
  lifestyle: [
    { slug: "food", title: "Food" },
    { slug: "travel", title: "Travel" },
    { slug: "culture", title: "Culture" },
    { slug: "health", title: "Health" },
    { slug: "beauty", title: "Beauty" },
  ],
};

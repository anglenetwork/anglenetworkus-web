/**
 * Central ranking policy for Supabase-backed article metrics (Stage 9).
 * Editorial ranking surfaces exclude sponsored by default.
 */

export const EDITORIAL_RANKING_TYPES = ["post", "opinion", "analysis"] as const;

export const POST_ONLY_RANKING_TYPES = ["post"] as const;

export const DEFAULT_EDITORIAL_RANKING_WINDOW = "7d" as const;

/** Fourth-section Most Read: standard posts by 7-day views. */
export const HOMEPAGE_FOURTH_SECTION_MOST_READ_LIMIT = 4 as const;

export const RANKING_TIEBREAK_RULE =
  "last_viewed_at_then_published_at" as const;

export type EditorialRankingType = (typeof EDITORIAL_RANKING_TYPES)[number];

export function isEditorialRankingType(
  type: string,
): type is EditorialRankingType {
  return (EDITORIAL_RANKING_TYPES as readonly string[]).includes(type);
}

/** True for post/opinion/analysis only; never sponsored. */
export function shouldIncludeInEditorialRanking(type: string): boolean {
  return isEditorialRankingType(type);
}

/** Most-read posts rail: standard posts only. */
export function shouldIncludeInMostReadPosts(type: string): boolean {
  return type === "post";
}

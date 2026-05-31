import type { ArticleFamilyDocType } from "./types";

/**
 * Explicit inclusion policies for feeds/lists/search. Sponsored is NEVER in these defaults.
 * Opt-in for sponsored must use dedicated helpers or includeSponsored: true at call sites.
 */

/** Standard homepage / news rails: standard reported news only */
export const FEED_STANDARD_NEWS_TYPES = [
  "post",
] as const satisfies readonly ArticleFamilyDocType[];

/** Opinion rail: opinion pieces only */
export const FEED_OPINION_TYPES = [
  "opinion",
] as const satisfies readonly ArticleFamilyDocType[];

/** Analysis rail: analysis only */
export const FEED_ANALYSIS_TYPES = [
  "analysis",
] as const satisfies readonly ArticleFamilyDocType[];

/** Mixed editorial (“Latest” page): no sponsored */
export const FEED_MIXED_EDITORIAL_TYPES = [
  "post",
  "opinion",
  "analysis",
] as const satisfies readonly ArticleFamilyDocType[];

/** Topic/category/tag listing: post + analysis (opinion has no taxonomy) */
export const FEED_TOPIC_CATEGORY_TAG_TYPES = [
  "post",
  "analysis",
] as const satisfies readonly ArticleFamilyDocType[];

/** Sitewide search (editorial): sponsored excluded by default */
export const FEED_SEARCH_EDITORIAL_TYPES = [
  "post",
  "opinion",
  "analysis",
] as const satisfies readonly ArticleFamilyDocType[];

/**
 * Related content is type-specific (see relatedContentFor*Query in article-family-queries):
 * — post pages: post + analysis
 * — opinion pages: opinion only
 * — analysis pages: analysis + post (ranked)
 * — sponsored pages: no related editorial block
 */
export const FEED_RELATED_EDITORIAL_TYPES = [
  "post",
  "opinion",
  "analysis",
] as const satisfies readonly ArticleFamilyDocType[];

/** Explicit sponsored-only inclusion (use only where product intends sponsored surfaces) */
export const FEED_SPONSORED_ONLY_TYPES = [
  "sponsored",
] as const satisfies readonly ArticleFamilyDocType[];

/** Build a GROQ `_type in [...]` literal from feed policy constants. */
export function groqTypeInList(
  types: readonly ArticleFamilyDocType[],
): string {
  return types.map((type) => `"${type}"`).join(", ");
}

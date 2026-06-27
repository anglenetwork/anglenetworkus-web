import type { ArticleFamilyDocType } from "./types";

/**
 * Explicit inclusion policies for feeds/lists/search. Sponsored is NEVER in these defaults.
 * Opt-in for sponsored must use dedicated helpers or includeSponsored: true at call sites.
 */

/** Standard homepage / news rails: standard reported news only */
const FEED_STANDARD_NEWS_TYPES = [
  "post",
] as const satisfies readonly ArticleFamilyDocType[];

/** Opinion rail: opinion pieces only */
const FEED_OPINION_TYPES = [
  "opinion",
] as const satisfies readonly ArticleFamilyDocType[];

/** Analysis rail: analysis only */
const FEED_ANALYSIS_TYPES = [
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

/** Explicit sponsored-only inclusion (use only where product intends sponsored surfaces) */
export const FEED_SPONSORED_ONLY_TYPES = [
  "sponsored",
] as const satisfies readonly ArticleFamilyDocType[];

/**
 * Static GROQ type literals for Sanity typegen.
 * Must be plain string constants — no array access or runtime joins.
 * Keep aligned with the FEED_*_TYPES arrays above.
 */
export const GROQ_TYPE_POST = "post" as const;
export const GROQ_TYPE_OPINION = "opinion" as const;
export const GROQ_TYPE_ANALYSIS = "analysis" as const;
export const GROQ_TYPE_SPONSORED = "sponsored" as const;

/** Comma-separated quoted types for `_type in [...]` GROQ filters. */
export const GROQ_IN_MIXED_EDITORIAL_TYPES = '"post", "opinion", "analysis"';
export const GROQ_IN_TOPIC_CATEGORY_TAG_TYPES = '"post", "analysis"';
export const GROQ_IN_BOOKMARK_HYDRATION_TYPES =
  '"post", "opinion", "analysis", "sponsored"';

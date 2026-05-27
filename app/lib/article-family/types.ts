/**
 * Single normalized contract for article-family documents (post, opinion, analysis, sponsored).
 */

export type ArticleFamilyDocType =
  | "post"
  | "opinion"
  | "analysis"
  | "sponsored";

export type ArticleFamilySeo = {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  ogImage?: unknown | null;
};

export type ArticleFamilyAuthor = {
  name: string;
  slug?: string | null;
  picture?: unknown;
};

/** Cover shape from GROQ (coverFieldsProjection) */
export type ArticleFamilyCover = {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: unknown;
  alt?: string | null;
  dimensions?: { width?: number; height?: number } | null;
};

export type ArticleFamilyCategory = {
  title: string;
  slug: string;
};

export type ArticleFamilyTag = {
  title: string;
  slug: string;
};

export type SponsorAttribution = {
  sponsorName: string;
  sponsorUrl?: string | null;
  disclosure: string;
};

export type ArticleFamily = {
  _id: string;
  _type: ArticleFamilyDocType;
  title: string;
  tickerTitle: string;
  excerpt: string | null;
  slug: string;
  href: string;
  cover: unknown;
  body: unknown[] | null;
  author: ArticleFamilyAuthor | null;
  publishedAt: string | null;
  updatedAt: string | null;
  /** Display date for legacy components (coalesce published/updated) */
  date: string;
  seo: ArticleFamilySeo | null;
  imageGallery?: unknown[] | null;
  category?: ArticleFamilyCategory | null;
  tags?: ArticleFamilyTag[] | null;
  disclosure?: string | null;
  analysisFocus?: string | null;
  methodologyNote?: string | null;
  sourcesNote?: string | null;
  sponsorAttribution?: SponsorAttribution | null;
};

/** Card/list preview shape (same fields as ArticleFamily but body optional empty) */
export type ArticleFamilyCard = Omit<ArticleFamily, "body"> & {
  body?: unknown[] | null;
};

/** `/api/search` result row — normalized card shape */
export type ArticleFamilySearchResult = ArticleFamilyCard;

/** Sidebar / related lists (normalized card + href) */
export type ArticleSidebarPost = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  href: string;
  excerpt?: string | null;
  cover?: unknown;
  date?: string;
  author?: ArticleFamilyAuthor | null;
  category?: ArticleFamilyCategory | null;
};

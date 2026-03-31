import type { Metadata } from "next";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";

const googleBotLargePreview: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

const googleBotNoindexFollow: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
    "max-image-preview": "large",
  },
};

/** post, opinion, analysis */
export function robotsIndexableArticle(): Metadata["robots"] {
  return googleBotLargePreview;
}

/** sponsored — public but not in organic index */
export function robotsSponsoredArticle(): Metadata["robots"] {
  return googleBotNoindexFollow;
}

/** /search, /latest */
export function robotsUtilityNoindex(): Metadata["robots"] {
  return googleBotNoindexFollow;
}

/**
 * Opinion / analysis index and taxonomy: page 1 with results → index; else noindex.
 */
export function robotsListingOrTaxonomy(args: {
  page: number;
  totalResults: number;
}): Metadata["robots"] {
  const { page, totalResults } = args;
  if (page <= 1 && totalResults > 0) {
    return googleBotLargePreview;
  }
  return googleBotNoindexFollow;
}

/** Homepage */
export function robotsHomepage(): Metadata["robots"] {
  return googleBotLargePreview;
}

export function robotsFromArticleType(
  t: ArticleFamilyDocType
): Metadata["robots"] {
  if (t === "sponsored") return robotsSponsoredArticle();
  return robotsIndexableArticle();
}

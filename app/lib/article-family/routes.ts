import type { ArticleFamilyDocType } from "./types";

/** Public path prefix per document type (post keeps existing /post/[slug] shape) */
export const ARTICLE_FAMILY_ROUTE_PREFIX: Record<ArticleFamilyDocType, string> = {
  post: "/post",
  opinion: "/opinion",
  analysis: "/analysis",
  sponsored: "/sponsored",
};

export function articleFamilyHref(
  type: ArticleFamilyDocType,
  slug: string
): string {
  return `${ARTICLE_FAMILY_ROUTE_PREFIX[type]}/${slug}`;
}

import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

/** @deprecated Prefer getPublicSiteUrl from @/app/lib/seo/site-url */
export function getSiteUrl(): string {
  return getPublicSiteUrl();
}

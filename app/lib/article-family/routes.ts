import type { ArticleFamilyDocType } from "./types";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

/** Public path prefix per document type (post keeps existing /post/[slug] shape) */
export const ARTICLE_FAMILY_ROUTE_PREFIX: Record<ArticleFamilyDocType, string> = {
  post: "/post",
  opinion: "/opinion",
  analysis: "/analysis",
  sponsored: "/sponsored",
};

export function articleFamilyCanonicalHref(
  type: ArticleFamilyDocType,
  slug: string
): string {
  return `${ARTICLE_FAMILY_ROUTE_PREFIX[type]}/${slug}`;
}

export function articleFamilyHref(
  type: ArticleFamilyDocType,
  slug: string,
  options?: { id?: string }
): string {
  const cleanHref = articleFamilyCanonicalHref(type, slug);
  if (type !== "post" || !options?.id) {
    return cleanHref;
  }
  return `${cleanHref}?id=${encodeURIComponent(options.id)}`;
}

/** @deprecated Prefer getPublicSiteUrl from @/app/lib/seo/site-url */
export function getSiteUrl(): string {
  return getPublicSiteUrl();
}

import type { ArticleFamilyDocType } from "./types";

/** Public path prefix per document type (post keeps existing /post/[slug] shape) */
const ARTICLE_FAMILY_ROUTE_PREFIX: Record<ArticleFamilyDocType, string> = {
  post: "/post",
  opinion: "/opinion",
  analysis: "/analysis",
  sponsored: "/sponsored",
};

export function articleFamilyCanonicalHref(
  type: ArticleFamilyDocType,
  slug: string,
): string {
  return `${ARTICLE_FAMILY_ROUTE_PREFIX[type]}/${slug}`;
}

export function articleFamilyHref(
  type: ArticleFamilyDocType,
  slug: string,
  options?: { id?: string },
): string {
  const cleanHref = articleFamilyCanonicalHref(type, slug);
  if (type !== "post" || !options?.id) {
    return cleanHref;
  }
  return `${cleanHref}?id=${encodeURIComponent(options.id)}`;
}

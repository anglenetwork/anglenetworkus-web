import { getCoverImage } from "@/sanity/lib/utils";
import type { ArticleFamily, ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import { getPublicSiteUrl } from "./site-url";
import { buildPublisherJsonLd, type PublisherJsonLd } from "./publisher";

function schemaArticleType(
  t: ArticleFamilyDocType
): "NewsArticle" | "Article" {
  if (t === "post" || t === "analysis") return "NewsArticle";
  return "Article";
}

function toAbsoluteImage(url: string | undefined, siteUrl: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

export function buildArticleJsonLd(
  article: ArticleFamily,
  args: {
    publisher: PublisherJsonLd;
  }
): Record<string, unknown> {
  const siteUrl = getPublicSiteUrl();
  const absoluteUrl = `${siteUrl}${articleFamilyCanonicalHref(
    article._type,
    article.slug
  )}`;
  const cover = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title
  );
  const rawImage = cover?.src;
  const image = rawImage ? [toAbsoluteImage(rawImage, siteUrl)].filter(Boolean) : undefined;

  const authorName = article.author?.name ?? "Anonymous";

  const keywords =
    article.tags?.length && article.tags.some((t) => t.title)
      ? article.tags.map((t) => t.title).filter(Boolean)
      : undefined;

  const description =
    article.excerpt?.trim() ||
    undefined;

  const out: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaArticleType(article._type),
    headline: article.title,
    description,
    image,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: args.publisher,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl,
    },
  };

  if (article.category?.title) {
    out.articleSection = article.category.title;
  }
  if (keywords?.length) {
    out.keywords = keywords.join(", ");
  }

  return out;
}

export type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[],
  siteUrl: string = getPublicSiteUrl()
): Record<string, unknown> {
  const list = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };
}

export function buildWebsiteJsonLd(args: {
  siteName: string;
  siteUrl: string;
  publisher: PublisherJsonLd;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: args.siteName,
    url: args.siteUrl,
    publisher: args.publisher,
  };
}

export { buildPublisherJsonLd };

import { getCoverImage } from "@/sanity/lib/utils";
import type {
  ArticleFamily,
  ArticleFamilyCover,
  ArticleFamilyDocType,
} from "@/app/lib/article-family/types";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import { getPublicSiteUrl } from "./site-url";
import {
  buildPublisherJsonLd,
  buildNewsMediaOrganizationJsonLd,
  type PublisherJsonLd,
} from "./publisher";

function schemaArticleType(t: ArticleFamilyDocType): "NewsArticle" | "Article" {
  if (t === "post" || t === "analysis") return "NewsArticle";
  return "Article";
}

function toAbsoluteImage(
  url: string | undefined,
  siteUrl: string,
): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

/** Primary cover image for article JSON-LD — ImageObject when Sanity dimensions exist. */
export function buildArticleImagesJsonLd(
  cover: unknown,
  fallbackAlt: string,
  siteUrl: string = getPublicSiteUrl(),
): (string | Record<string, unknown>)[] | undefined {
  const coverData = cover as ArticleFamilyCover | null | undefined;
  const resolved = getCoverImage(
    coverData as Parameters<typeof getCoverImage>[0],
    fallbackAlt,
  );
  if (!resolved?.src) return undefined;

  const absoluteUrl = toAbsoluteImage(resolved.src, siteUrl);
  if (!absoluteUrl) return undefined;

  const width = coverData?.dimensions?.width;
  const height = coverData?.dimensions?.height;
  if (
    typeof width === "number" &&
    typeof height === "number" &&
    width > 0 &&
    height > 0
  ) {
    return [
      {
        "@type": "ImageObject",
        url: absoluteUrl,
        width,
        height,
      },
    ];
  }

  return [absoluteUrl];
}

function buildArticleAuthorJsonLd(
  article: ArticleFamily,
  siteUrl: string,
): Record<string, unknown> {
  const name = article.author?.name ?? "Anonymous";
  const author: Record<string, unknown> = {
    "@type": "Person",
    name,
  };
  const slug = article.author?.slug?.trim();
  if (slug) {
    author.url = `${siteUrl}/author/${slug}`;
  }
  return author;
}

export function buildArticleJsonLd(
  article: ArticleFamily,
  args: {
    publisher: PublisherJsonLd;
  },
): Record<string, unknown> {
  const siteUrl = getPublicSiteUrl();
  const absoluteUrl = `${siteUrl}${articleFamilyCanonicalHref(
    article._type,
    article.slug,
  )}`;
  const image = buildArticleImagesJsonLd(article.cover, article.title, siteUrl);

  const keywords = article.tags?.flatMap((t) => (t.title ? [t.title] : []));

  const description = article.excerpt?.trim() || undefined;

  const out: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaArticleType(article._type),
    headline: article.title,
    description,
    image,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
    author: buildArticleAuthorJsonLd(article, siteUrl),
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
  siteUrl: string = getPublicSiteUrl(),
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
  publisher?: PublisherJsonLd | { "@id": string };
  organizationId?: string;
}): Record<string, unknown> {
  const publisher =
    args.publisher ??
    (args.organizationId
      ? { "@id": args.organizationId }
      : buildPublisherJsonLd({
          siteName: args.siteName,
          siteUrl: args.siteUrl,
        }));

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: args.siteName,
    url: args.siteUrl,
    publisher,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${args.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type AuthorSocialInput = {
  website?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
};

export function buildAuthorSameAsUrls(
  social: AuthorSocialInput,
): string[] | undefined {
  const urls: string[] = [];
  const website = social.website?.trim();
  if (website) urls.push(website);

  const twitter = social.twitter?.trim();
  if (twitter) {
    urls.push(
      twitter.startsWith("http")
        ? twitter
        : `https://twitter.com/${twitter.replace(/^@/, "")}`,
    );
  }

  const linkedin = social.linkedin?.trim();
  if (linkedin) {
    urls.push(
      linkedin.startsWith("http")
        ? linkedin
        : `https://www.linkedin.com/in/${linkedin}`,
    );
  }

  const instagram = social.instagram?.trim();
  if (instagram) {
    urls.push(
      instagram.startsWith("http")
        ? instagram
        : `https://www.instagram.com/${instagram.replace(/^@/, "")}`,
    );
  }

  return urls.length > 0 ? urls : undefined;
}

export function buildPersonJsonLd(args: {
  name: string;
  slug: string;
  siteUrl?: string;
  sameAs?: string[];
}): Record<string, unknown> {
  const siteUrl = args.siteUrl ?? getPublicSiteUrl();
  const out: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: args.name,
    url: `${siteUrl}/author/${args.slug}`,
  };
  if (args.sameAs?.length) {
    out.sameAs = args.sameAs;
  }
  return out;
}

export { buildPublisherJsonLd, buildNewsMediaOrganizationJsonLd };

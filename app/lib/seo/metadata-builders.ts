import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import { getCoverImage, resolveOpenGraphImage } from "@/sanity/lib/utils";
import type { ArticleFamily } from "@/app/lib/article-family/types";
import { articleFamilyCanonicalHref } from "@/app/lib/article-family/routes";
import { getPublicSiteUrl } from "./site-url";
import { buildCanonicalUrl } from "./canonical";
import {
  robotsDraftPreview,
  robotsFromArticleType,
  robotsHomepage,
  robotsIndexableArticle,
  robotsListingOrTaxonomy,
  robotsUtilityNoindex,
} from "./robots";

/** When draft preview is active, force noindex/nofollow on all public metadata. */
export async function finalizePublicMetadata(
  metadata: Metadata,
): Promise<Metadata> {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return metadata;
  return { ...metadata, robots: robotsDraftPreview() };
}

const DESCRIPTION_MAX = 320;

function isNonEmpty(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

function sameOriginCanonical(siteUrl: string, url: string): boolean {
  try {
    const base = new URL(siteUrl);
    const u = new URL(url);
    return u.origin === base.origin;
  } catch {
    return false;
  }
}

function trimDescription(s: string): string {
  const t = s.trim();
  if (t.length <= DESCRIPTION_MAX) return t;
  return `${t.slice(0, DESCRIPTION_MAX - 1).trim()}…`;
}

function articleDescription(article: ArticleFamily): string {
  const seo = article.seo;
  if (isNonEmpty(seo?.description))
    return trimDescription(seo!.description!.trim());
  if (isNonEmpty(article.excerpt))
    return trimDescription(article.excerpt.trim());
  const blocks = article.body as PortableTextBlock[] | null | undefined;
  if (blocks?.length) {
    const plain = toPlainText(blocks).trim();
    if (plain) return trimDescription(plain);
  }
  return "";
}

export type SiteSettingsForSeo = {
  title?: string | null;
  ogImage?: unknown;
};
export type SiteSettingsWithDescription = SiteSettingsForSeo & {
  description?: unknown;
};

export function resolveSiteName(
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string,
): string {
  return (settings?.title && String(settings.title).trim()) || demoTitle;
}

export function buildArticlePageMetadata(
  article: ArticleFamily,
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string,
): Metadata {
  const siteUrl = getPublicSiteUrl();
  const siteName = resolveSiteName(settings, demoTitle);
  const seo = article.seo;
  const titleBase = isNonEmpty(seo?.title) ? seo!.title!.trim() : article.title;

  const ogTitle = isNonEmpty(seo?.title) ? seo!.title!.trim() : article.title;
  const description = articleDescription(article);

  const ogFromSeo = resolveOpenGraphImage(
    seo?.ogImage as Parameters<typeof resolveOpenGraphImage>[0],
  );
  const coverOg = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title,
  );
  const siteFallback = resolveOpenGraphImage(
    settings?.ogImage as Parameters<typeof resolveOpenGraphImage>[0],
  );

  const fallbackImageUrl = coverOg?.src;
  const siteFallbackUrl = siteFallback?.url;

  const ogImages =
    ogFromSeo?.url != null
      ? [{ url: ogFromSeo.url, alt: ogFromSeo.alt }]
      : fallbackImageUrl
        ? [{ url: fallbackImageUrl }]
        : siteFallbackUrl
          ? [{ url: siteFallbackUrl, alt: siteFallback.alt }]
          : undefined;

  const canonicalFromSeo =
    isNonEmpty(seo?.canonicalUrl) &&
    sameOriginCanonical(siteUrl, seo!.canonicalUrl!)
      ? seo!.canonicalUrl!.trim()
      : undefined;
  const canonicalPath = `${siteUrl}${articleFamilyCanonicalHref(
    article._type,
    article.slug,
  )}`;

  const ogDescription = isNonEmpty(seo?.description)
    ? seo!.description!.trim()
    : description;

  const ogTitleFinal = ogTitle;
  const twitterCard: "summary_large_image" | "summary" = ogImages?.length
    ? "summary_large_image"
    : "summary";

  return {
    title: { absolute: `${titleBase} | ${siteName}` },
    description,
    robots: robotsFromArticleType(article._type),
    alternates: {
      canonical: canonicalFromSeo ?? canonicalPath,
    },
    openGraph: {
      title: ogTitleFinal,
      description: ogDescription,
      url: canonicalFromSeo ?? canonicalPath,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? undefined,
      images: ogImages,
    },
    twitter: {
      card: twitterCard,
      title: ogTitleFinal,
      description: ogDescription,
      images: ogImages?.map((i) => i.url),
    },
  };
}

export function buildHomepageMetadata(
  settings: SiteSettingsWithDescription | null | undefined,
  demoTitle: string,
  demoDescriptionPlain: string,
): Metadata {
  const siteUrl = getPublicSiteUrl().replace(/\/$/, "");
  const siteName = resolveSiteName(settings, demoTitle);
  let description = demoDescriptionPlain;
  if (settings?.description) {
    if (typeof settings.description === "string") {
      const t = settings.description.trim();
      if (t) description = t;
    } else {
      const plain = toPlainText(
        settings.description as PortableTextBlock[],
      ).trim();
      if (plain) description = plain;
    }
  }

  const ogImage = resolveOpenGraphImage(
    settings?.ogImage as Parameters<typeof resolveOpenGraphImage>[0],
  );
  const ogImages = ogImage?.url
    ? [{ url: ogImage.url, alt: ogImage.alt }]
    : undefined;
  const twitterCard: "summary_large_image" | "summary" = ogImages?.length
    ? "summary_large_image"
    : "summary";
  const pageTitle = siteName;

  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsHomepage(),
    alternates: {
      canonical: `${siteUrl}/`,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: `${siteUrl}/`,
      type: "website",
      siteName,
      images: ogImages,
    },
    twitter: {
      card: twitterCard,
      title: pageTitle,
      description,
      images: ogImages?.map((i) => i.url),
    },
  };
}

export function buildOpinionIndexMetadata(
  page: number,
  total: number,
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string,
): Metadata {
  const siteName = resolveSiteName(settings, demoTitle);
  const description =
    "Commentary and opinion from our editors and contributors — perspectives on the news that matter.";
  const pageTitle = `Opinion | ${siteName}`;
  const canonical = buildCanonicalUrl(
    "/opinion",
    page > 1 ? new URLSearchParams({ page: String(page) }) : undefined,
  );
  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsListingOrTaxonomy({ page, totalResults: total }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

export function buildAnalysisIndexMetadata(
  page: number,
  total: number,
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string,
): Metadata {
  const siteName = resolveSiteName(settings, demoTitle);
  const description =
    "Analysis and explanatory journalism — data, context, and deep dives on stories that matter.";
  const pageTitle = `Analysis | ${siteName}`;
  const canonical = buildCanonicalUrl(
    "/analysis",
    page > 1 ? new URLSearchParams({ page: String(page) }) : undefined,
  );
  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsListingOrTaxonomy({ page, totalResults: total }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

export function buildLatestPageMetadata(
  page: number,
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string,
): Metadata {
  const siteName = resolveSiteName(settings, demoTitle);
  const description =
    "The newest reporting, opinion, and analysis from our newsroom — updated continuously.";
  const pageTitle = `Latest | ${siteName}`;
  const canonical = buildCanonicalUrl(
    "/latest",
    page > 1 ? new URLSearchParams({ page: String(page) }) : undefined,
  );
  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsUtilityNoindex(),
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

export function buildSearchPageMetadata(
  searchParams: Record<string, string | string[] | undefined>,
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string,
): Metadata {
  const siteName = resolveSiteName(settings, demoTitle);
  const qRaw = searchParams.q;
  const q =
    typeof qRaw === "string"
      ? qRaw.trim()
      : Array.isArray(qRaw)
        ? (qRaw[0]?.trim() ?? "")
        : "";

  const sort = (() => {
    const s = searchParams.sort;
    const v = typeof s === "string" ? s : Array.isArray(s) ? s[0] : "";
    return v === "newest" ? "newest" : "relevance";
  })();

  const type = (() => {
    const t = searchParams.type;
    const v = typeof t === "string" ? t : Array.isArray(t) ? t[0] : "";
    if (v === "post" || v === "opinion" || v === "analysis") return v;
    return "all";
  })();

  const page = (() => {
    const p = searchParams.page;
    const v = typeof p === "string" ? p : Array.isArray(p) ? p[0] : "1";
    const n = parseInt(v || "1", 10);
    return Number.isFinite(n) && n >= 1 ? n : 1;
  })();

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  sp.set("sort", sort);
  sp.set("type", type);
  if (page > 1) sp.set("page", String(page));

  const canonical = buildCanonicalUrl("/search", sp, {
    allowedKeys: ["q", "sort", "type", "page"],
  });

  const titleStr = q
    ? `Search results for "${q}" | ${siteName}`
    : `Search | ${siteName}`;

  const description =
    "Search our newsroom — find reporting, opinion, and analysis across the site.";

  return {
    title: { absolute: titleStr },
    description,
    robots: robotsUtilityNoindex(),
    alternates: { canonical },
    openGraph: {
      title: titleStr,
      description,
      url: canonical,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: titleStr,
      description,
    },
  };
}

export function buildCategoryPageMetadata(args: {
  categoryName: string;
  resultCount: number;
  settings: SiteSettingsForSeo | null | undefined;
  demoTitle: string;
  slug: string;
}): Metadata {
  const siteName = resolveSiteName(args.settings, args.demoTitle);
  const term = args.categoryName;
  const description = `Latest news and stories in ${term} — coverage, explainers, and updates from our editors.`;
  const pageTitle = `${term} | ${siteName}`;
  const canonical = buildCanonicalUrl(`/category/${args.slug}`);
  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsListingOrTaxonomy({
      page: 1,
      totalResults: args.resultCount,
    }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

export function buildAuthorPageMetadata(args: {
  authorName: string;
  shortBio?: string | null;
  settings: SiteSettingsForSeo | null | undefined;
  demoTitle: string;
  slug: string;
}): Metadata {
  const siteName = resolveSiteName(args.settings, args.demoTitle);
  const pageTitle = `${args.authorName} | ${siteName}`;
  const description =
    args.shortBio?.trim() ||
    `Articles and reporting by ${args.authorName} at ${siteName}.`;
  const canonical = buildCanonicalUrl(`/author/${args.slug}`);
  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsIndexableArticle(),
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "profile",
      siteName,
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
    },
  };
}

export function buildTagPageMetadata(args: {
  tagTitle: string;
  resultCount: number;
  settings: SiteSettingsForSeo | null | undefined;
  demoTitle: string;
  slug: string;
}): Metadata {
  const siteName = resolveSiteName(args.settings, args.demoTitle);
  const term = args.tagTitle;
  const description = `Articles and reporting tagged ${term} — stories, analysis, and context.`;
  const pageTitle = `${term} | ${siteName}`;
  const canonical = buildCanonicalUrl(`/tag/${args.slug}`);
  return {
    title: { absolute: pageTitle },
    description,
    robots: robotsListingOrTaxonomy({
      page: 1,
      totalResults: args.resultCount,
    }),
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
  };
}

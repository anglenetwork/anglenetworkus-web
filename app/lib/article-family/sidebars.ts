import "server-only";

import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  latestNews4Query,
  popularReadsFallbackQuery,
  postsByIdsLightweightQuery,
} from "@/sanity/lib/queries";
import {
  getMostReadPosts,
  orderDocumentsByIds,
} from "@/app/lib/article-family/metrics";
import { logDevMetricsFallback } from "@/app/lib/article-family/metrics-dev-log";
import {
  latestInCategoryForRelatedQuery,
  relatedContentForAnalysisQuery,
  relatedContentForOpinionQuery,
  relatedContentForPostQuery,
} from "@/sanity/lib/article-family-queries";
import type { ArticleFamily, ArticleSidebarPost } from "./types";
import { normalizeArticleFamilyCard } from "./normalize";
import { articleFamilyHref } from "./routes";

export type SidebarArticleLink = ArticleSidebarPost;

function attachPostHref(
  rows: Array<Record<string, unknown>> | null | undefined
): SidebarArticleLink[] {
  return (rows || [])
    .filter((r) => typeof r.slug === "string" && r.slug)
    .map((r) => {
      const slug = r.slug as string;
      return {
        _id: String(r._id ?? ""),
        _type: "post",
        title: String(r.title ?? ""),
        slug,
        href: articleFamilyHref("post", slug),
        excerpt: r.excerpt as string | null | undefined,
        cover: r.cover,
        date:
          typeof r.date === "string"
            ? r.date
            : typeof r.publishedAt === "string"
              ? r.publishedAt
              : undefined,
        author: r.author as SidebarArticleLink["author"],
        category: r.category as SidebarArticleLink["category"],
      };
    });
}

function relatedQueryFor(article: ArticleFamily) {
  if (article._type === "sponsored") return null;
  if (article._type === "post") return relatedContentForPostQuery;
  if (article._type === "opinion") return relatedContentForOpinionQuery;
  return relatedContentForAnalysisQuery;
}

export async function loadArticlePageSidebars(article: ArticleFamily) {
  const rq = relatedQueryFor(article);
  const relatedPromise = rq
    ? sanityFetch({
        query: rq,
        params: {
          slug: article.slug,
          currentId: article._id,
          categorySlug: article.category?.slug ?? "",
          limit: 18,
        },
      })
    : Promise.resolve([]);

  const [latestOverall, popularReads, relatedRaw] = await Promise.all([
    client.fetch(latestNews4Query, { currentPostId: article._id }),
    (async () => {
      try {
        const ranked = await getMostReadPosts({ limit: 24 });
        const hasActivity = ranked.some((r) => r.views7d > 0 || r.viewsAll > 0);
        const filtered = ranked.filter((r) => r.articleId !== article._id);
        if (!filtered.length || !hasActivity) {
          logDevMetricsFallback("article_sidebar_popular", "empty_or_no_activity");
          return await client.fetch(popularReadsFallbackQuery, {
            currentPostId: article._id,
          });
        }
        const ids = filtered.slice(0, 8).map((r) => r.articleId);
        const raw = await client.fetch(postsByIdsLightweightQuery, {
          ids,
        });
        const ordered = orderDocumentsByIds(
          raw as { _id: string }[],
          ids
        );
        if (ordered.length === 0) {
          logDevMetricsFallback("article_sidebar_popular", "empty_or_no_activity");
          return await client.fetch(popularReadsFallbackQuery, {
            currentPostId: article._id,
          });
        }
        return ordered.slice(0, 4);
      } catch {
        logDevMetricsFallback("article_sidebar_popular", "infra_error");
        return await client.fetch(popularReadsFallbackQuery, {
          currentPostId: article._id,
        });
      }
    })(),
    relatedPromise,
  ]);

  const relatedNorm = (relatedRaw || [])
    .map((r: unknown) => normalizeArticleFamilyCard(r))
    .filter((r): r is NonNullable<typeof r> => r != null);

  const relatedArticles: SidebarArticleLink[] = relatedNorm.map((r) => ({
    _id: r._id,
    _type: r._type,
    title: r.title,
    slug: r.slug,
    href: r.href,
    excerpt: r.excerpt,
    cover: r.cover,
    date: r.date,
    author: r.author ?? null,
    category: r.category ?? null,
  }));

  return {
    newsForYou: attachPostHref(latestOverall),
    popularReads: attachPostHref(popularReads),
    relatedArticles,
  };
}

/**
 * Latest N articles in the same category as the given article (post + analysis),
 * excluding the article itself. Returns [] when the article has no category.
 *
 * Fetch limits for the related module: 7 (classic: 1 hero + 6 list),
 * 10 (modern: 6 grid + 4 sidebar).
 */
export async function loadLatestInCategory(
  article: ArticleFamily,
  limit: number
): Promise<SidebarArticleLink[]> {
  const categorySlug = article.category?.slug;
  if (!categorySlug) return [];

  const rows = await sanityFetch({
    query: latestInCategoryForRelatedQuery,
    params: {
      categorySlug,
      currentId: article._id,
      limit,
    },
  });

  const normalized = (rows || [])
    .map((r: unknown) => normalizeArticleFamilyCard(r))
    .filter((r): r is NonNullable<typeof r> => r != null);

  return normalized.map((r) => ({
    _id: r._id,
    _type: r._type,
    title: r.title,
    slug: r.slug,
    href: r.href,
    excerpt: r.excerpt,
    cover: r.cover,
    date: r.date,
    author: r.author ?? null,
    category: r.category ?? null,
  }));
}

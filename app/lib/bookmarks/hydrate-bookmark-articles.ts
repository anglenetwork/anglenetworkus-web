import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  articleFamilyBookmarksByIdsQuery,
  articleFamilyBookmarksBySlugsQuery,
} from "@/sanity/lib/article-family-queries";
import {
  expandSanityIdsForLookup,
  indexBookmarkArticlesByPublishedId,
  publishedSanityDocumentId,
  type BookmarkArticleRow,
} from "./bookmark-article-helpers";

export async function hydrateBookmarkArticles(
  bookmarks: Array<{ article_id: string; article_slug: string | null }>,
): Promise<Record<string, BookmarkArticleRow>> {
  const articleIds = bookmarks.map((bookmark) => bookmark.article_id);
  const articlesByPublishedId: Record<string, BookmarkArticleRow> = {};

  if (articleIds.length === 0) {
    return articlesByPublishedId;
  }

  try {
    const byId = await sanityFetchStatic({
      query: articleFamilyBookmarksByIdsQuery,
      params: { ids: expandSanityIdsForLookup(articleIds) },
      requestTag: "bookmarks.by-id",
    });

    if (Array.isArray(byId)) {
      Object.assign(
        articlesByPublishedId,
        indexBookmarkArticlesByPublishedId(byId),
      );
    }
  } catch (error) {
    console.error("Error fetching bookmark articles by id from Sanity:", error);
  }

  const missingSlugs = [
    ...new Set(
      bookmarks
        .filter(
          (bookmark) =>
            !articlesByPublishedId[
              publishedSanityDocumentId(bookmark.article_id)
            ],
        )
        .map((bookmark) => bookmark.article_slug?.trim())
        .filter((slug): slug is string => !!slug),
    ),
  ];

  if (missingSlugs.length === 0) {
    return articlesByPublishedId;
  }

  try {
    const bySlug = await sanityFetchStatic({
      query: articleFamilyBookmarksBySlugsQuery,
      params: { slugs: missingSlugs },
      requestTag: "bookmarks.by-slug",
    });

    if (Array.isArray(bySlug)) {
      for (const article of bySlug) {
        const slug = article?.slug?.trim();
        if (!slug) continue;

        for (const bookmark of bookmarks) {
          if (bookmark.article_slug?.trim() !== slug) continue;

          const publishedId = publishedSanityDocumentId(bookmark.article_id);
          if (!articlesByPublishedId[publishedId]) {
            articlesByPublishedId[publishedId] = article;
          }
        }
      }
    }
  } catch (error) {
    console.error(
      "Error fetching bookmark articles by slug from Sanity:",
      error,
    );
  }

  return articlesByPublishedId;
}

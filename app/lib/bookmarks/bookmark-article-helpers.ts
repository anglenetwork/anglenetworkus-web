import type { ArticleFamilyBookmarksByIdsQueryResult } from "@/sanity.types";

export type BookmarkArticleRow = ArticleFamilyBookmarksByIdsQueryResult[number];

export function publishedSanityDocumentId(id: string): string {
  return id.replace(/^drafts\./, "");
}

/** Expand stored bookmark ids so published and draft Sanity ids both match. */
export function expandSanityIdsForLookup(ids: string[]): string[] {
  const set = new Set<string>();

  for (const id of ids) {
    const trimmed = id.trim();
    if (!trimmed) continue;

    set.add(trimmed);
    const published = publishedSanityDocumentId(trimmed);
    set.add(published);
    set.add(`drafts.${published}`);
  }

  return [...set];
}

export function indexBookmarkArticlesByPublishedId(
  articles: BookmarkArticleRow[],
): Record<string, BookmarkArticleRow> {
  const map: Record<string, BookmarkArticleRow> = {};

  for (const article of articles) {
    if (article?._id) {
      map[publishedSanityDocumentId(article._id)] = article;
    }
  }

  return map;
}

export function resolveBookmarkArticleTitle(
  sanityTitle: string | null | undefined,
  storedTitle: string | null | undefined,
): string | null {
  const fromSanity = sanityTitle?.trim();
  if (fromSanity && fromSanity !== "Untitled") {
    return fromSanity;
  }

  const fromDb = storedTitle?.trim();
  return fromDb || null;
}

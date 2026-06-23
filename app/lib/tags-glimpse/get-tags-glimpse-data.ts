import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  latestArticleByTagGlimpseQuery,
  tagsByCategorySlugQuery,
} from "@/sanity/lib/queries";
import type {
  LatestArticleByTagGlimpseQueryResult,
  TagsByCategorySlugQueryResult,
} from "@/sanity.types";
import type { TagsGlimpseItem } from "@/app/components/tags-glimpse/types";
import { assembleTagsGlimpseItems } from "@/app/lib/tags-glimpse/assemble-tags-glimpse-items";
import { TAGS_GLIMPSE_TAG_POOL } from "@/app/lib/tags-glimpse/constants";

function normalizeTags(tags: unknown): TagsByCategorySlugQueryResult {
  return Array.isArray(tags) ? tags : [];
}

function normalizeArticles(
  articles: unknown,
): LatestArticleByTagGlimpseQueryResult {
  return Array.isArray(articles) ? articles : [];
}

/** Latest published article per tag for a category (up to four tags). */
export async function getTagsGlimpseData(
  categorySlug: string,
): Promise<TagsGlimpseItem[] | null> {
  const tags = normalizeTags(
    await sanityFetchStatic({
      query: tagsByCategorySlugQuery,
      params: { categorySlug, tagLimit: TAGS_GLIMPSE_TAG_POOL },
      tag: `category.tags-glimpse.${categorySlug}`,
    }),
  ).filter(
    (tag): tag is { slug: string; title: string | null } =>
      typeof tag.slug === "string",
  );

  if (tags.length === 0) return null;

  const items = await assembleTagsGlimpseItems(
    tags,
    async (tagSlug, excludeIds) => {
      const raw = await sanityFetchStatic({
        query: latestArticleByTagGlimpseQuery,
        params: { tagSlug, excludeIds },
        tag: `category.tags-glimpse.${categorySlug}.${tagSlug}`,
      });

      return normalizeArticles(raw)[0] ?? null;
    },
  );

  return items.length > 0 ? items : null;
}

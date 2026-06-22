import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  latestArticleByTagGlimpseQuery,
  tagsByCategorySlugQuery,
} from "@/sanity/lib/queries";
import type {
  LatestArticleByTagGlimpseQueryResult,
  TagsByCategorySlugQueryResult,
} from "@/sanity.types";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import type { TagsGlimpseItem } from "@/app/components/tags-glimpse/types";

const TAG_GLIMPSE_DOC_TYPES = new Set<ArticleFamilyDocType>([
  "post",
  "analysis",
]);

type TagGlimpseArticleRow = LatestArticleByTagGlimpseQueryResult[number];

function resolveArticleHref(row: TagGlimpseArticleRow): string | undefined {
  const docType = row._type;
  if (
    !docType ||
    !TAG_GLIMPSE_DOC_TYPES.has(docType as ArticleFamilyDocType) ||
    !row.slug
  ) {
    return undefined;
  }

  return articleFamilyHref(docType as ArticleFamilyDocType, row.slug, {
    id: row._id,
  });
}

function normalizeTags(
  tags: unknown,
): TagsByCategorySlugQueryResult {
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
      params: { categorySlug },
      tag: `category.tags-glimpse.${categorySlug}`,
    }),
  ).filter(
    (tag): tag is { slug: string; title: string | null } =>
      typeof tag.slug === "string",
  );

  if (tags.length === 0) return null;

  const items: TagsGlimpseItem[] = [];
  const excludeIds: string[] = [];

  for (const tag of tags) {
    const raw = await sanityFetchStatic({
      query: latestArticleByTagGlimpseQuery,
      params: { tagSlug: tag.slug, excludeIds },
      tag: `category.tags-glimpse.${categorySlug}.${tag.slug}`,
    });

    const article = normalizeArticles(raw)[0];
    const href = article ? resolveArticleHref(article) : undefined;
    if (!article?.slug || !href) continue;

    excludeIds.push(article._id);
    items.push({
      tagSlug: tag.slug,
      tagTitle: tag.title?.trim() || tag.slug,
      article: {
        title: article.title,
        slug: article.slug,
        href,
        readTime: article.readTime,
        cover: article.cover as TagsGlimpseItem["article"]["cover"],
        imageGallery:
          article.imageGallery as TagsGlimpseItem["article"]["imageGallery"],
      },
    });
  }

  return items.length > 0 ? items : null;
}

import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import type { TagsGlimpseItem } from "@/app/components/tags-glimpse/types";
import { TAGS_GLIMPSE_TAG_COUNT } from "@/app/lib/tags-glimpse/constants";
import type { LatestArticleByTagGlimpseQueryResult } from "@/sanity.types";

const TAG_GLIMPSE_DOC_TYPES = new Set<ArticleFamilyDocType>([
  "post",
  "analysis",
]);

type TagRow = { slug: string; title: string | null };

type ArticleRow = LatestArticleByTagGlimpseQueryResult[number];

function resolveArticleHref(row: ArticleRow): string | undefined {
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

function toTagsGlimpseItem(
  tag: TagRow,
  article: ArticleRow & { slug: string },
): TagsGlimpseItem {
  const href = resolveArticleHref(article);
  if (!href) {
    throw new Error(
      `assembleTagsGlimpseItems: unresolved href for ${article._id}`,
    );
  }

  return {
    tagSlug: tag.slug,
    tagTitle: tag.title?.trim() || tag.slug,
    article: {
      title: article.title?.trim() || "Untitled",
      slug: article.slug,
      href,
      readTime: article.readTime,
      cover: article.cover as TagsGlimpseItem["article"]["cover"],
      imageGallery:
        article.imageGallery as TagsGlimpseItem["article"]["imageGallery"],
    },
  };
}

/** Picks up to four tags with distinct latest articles (skips tags without articles). */
export async function assembleTagsGlimpseItems(
  tags: TagRow[],
  getLatestArticle: (
    tagSlug: string,
    excludeIds: string[],
  ) => Promise<ArticleRow | null | undefined>,
  maxItems = TAGS_GLIMPSE_TAG_COUNT,
): Promise<TagsGlimpseItem[]> {
  const initialArticles = await Promise.all(
    tags.map((tag) => getLatestArticle(tag.slug, [])),
  );

  async function collectItems(
    index: number,
    excludeIds: Set<string>,
    items: TagsGlimpseItem[],
  ): Promise<TagsGlimpseItem[]> {
    if (index >= tags.length || items.length >= maxItems) {
      return items;
    }

    const tag = tags[index];
    let article = initialArticles[index];

    if (article && excludeIds.has(article._id)) {
      article = await getLatestArticle(tag.slug, [...excludeIds]);
    }

    const href = article ? resolveArticleHref(article) : undefined;
    if (article?.slug && href) {
      excludeIds.add(article._id);
      items.push(
        toTagsGlimpseItem(tag, article as ArticleRow & { slug: string }),
      );
    }

    return collectItems(index + 1, excludeIds, items);
  }

  return collectItems(0, new Set(), []);
}

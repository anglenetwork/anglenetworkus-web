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

/** Picks up to four tags with distinct latest articles (skips tags without articles). */
export async function assembleTagsGlimpseItems(
  tags: TagRow[],
  getLatestArticle: (
    tagSlug: string,
    excludeIds: string[],
  ) => Promise<ArticleRow | null | undefined>,
  maxItems = TAGS_GLIMPSE_TAG_COUNT,
): Promise<TagsGlimpseItem[]> {
  const items: TagsGlimpseItem[] = [];
  const excludeIds: string[] = [];

  for (const tag of tags) {
    if (items.length >= maxItems) break;

    const article = await getLatestArticle(tag.slug, excludeIds);
    const href = article ? resolveArticleHref(article) : undefined;
    if (!article?.slug || !href) continue;

    excludeIds.push(article._id);
    items.push({
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
    });
  }

  return items;
}

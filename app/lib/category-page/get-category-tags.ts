import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { tagsByCategorySlugQuery } from "@/sanity/lib/queries";
import type { TagsByCategorySlugQueryResult } from "@/sanity.types";

export type CategoryTag = {
  slug: string;
  title: string;
};

function normalizeTags(tags: unknown): TagsByCategorySlugQueryResult {
  return Array.isArray(tags) ? tags : [];
}

/** Tags assigned to a category (for category page header at xl+). */
export async function getCategoryTags(
  categorySlug: string,
): Promise<CategoryTag[]> {
  const tags = normalizeTags(
    await sanityFetchStatic({
      query: tagsByCategorySlugQuery,
      params: { categorySlug, tagLimit: 100 },
      tag: `category.tags.${categorySlug}`,
    }),
  );

  return tags
    .filter(
      (tag): tag is { slug: string; title: string | null } =>
        typeof tag.slug === "string",
    )
    .map((tag) => ({
      slug: tag.slug,
      title: tag.title ?? tag.slug,
    }));
}

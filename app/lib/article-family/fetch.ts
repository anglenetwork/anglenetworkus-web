import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  articleFamilyPageByIdQuery,
  articleFamilyPageBySlugQuery,
} from "@/sanity/lib/article-family-queries";
import type { ArticleFamilyDocType } from "./types";
import { normalizeArticleFamily } from "./normalize";
import type { ArticleFamily } from "./types";

export async function fetchArticleFamilyPage(params: {
  type: ArticleFamilyDocType;
  slug: string;
  id?: string;
}): Promise<ArticleFamily | null> {
  if (params.id) {
    const rawById = await sanityFetch({
      query: articleFamilyPageByIdQuery,
      params: { type: params.type, slug: params.slug, id: params.id },
    });
    return normalizeArticleFamily(rawById);
  }

  const raw = await sanityFetch({
    query: articleFamilyPageBySlugQuery,
    params: { type: params.type, slug: params.slug },
  });
  return normalizeArticleFamily(raw);
}

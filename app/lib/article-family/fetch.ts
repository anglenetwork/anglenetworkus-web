import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import { articleFamilyPageBySlugQuery } from "@/sanity/lib/article-family-queries";
import type { ArticleFamilyDocType } from "./types";
import { normalizeArticleFamily } from "./normalize";
import type { ArticleFamily } from "./types";

export async function fetchArticleFamilyPage(params: {
  type: ArticleFamilyDocType;
  slug: string;
}): Promise<ArticleFamily | null> {
  const raw = await sanityFetch({
    query: articleFamilyPageBySlugQuery,
    params: { type: params.type, slug: params.slug },
  });
  return normalizeArticleFamily(raw);
}

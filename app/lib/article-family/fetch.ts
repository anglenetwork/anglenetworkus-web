import "server-only";

import { draftMode } from "next/headers";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  articleFamilyPageByIdPreviewQuery,
  articleFamilyPageByIdQuery,
  articleFamilyPageBySlugPreviewQuery,
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
  const { isEnabled: isPreview } = await draftMode();

  if (params.id) {
    const rawById = await sanityFetch({
      query: isPreview
        ? articleFamilyPageByIdPreviewQuery
        : articleFamilyPageByIdQuery,
      params: { type: params.type, slug: params.slug, id: params.id },
    });
    return normalizeArticleFamily(rawById);
  }

  const raw = await sanityFetch({
    query: isPreview
      ? articleFamilyPageBySlugPreviewQuery
      : articleFamilyPageBySlugQuery,
    params: { type: params.type, slug: params.slug },
  });
  return normalizeArticleFamily(raw);
}

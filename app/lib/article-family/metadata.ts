import "server-only";

import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import { buildArticlePageMetadata } from "@/app/lib/seo/metadata-builders";
import type { ArticleFamily } from "./types";

export async function buildArticleFamilyMetadata(
  article: ArticleFamily
): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  return buildArticlePageMetadata(article, settings, demo.title);
}

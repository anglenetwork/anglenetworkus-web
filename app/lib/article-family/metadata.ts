import "server-only";

import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import * as demo from "@/sanity/lib/demo";
import {
  buildArticlePageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import type { ArticleFamily } from "./types";

export async function buildArticleFamilyMetadata(
  article: ArticleFamily,
): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });
  return finalizePublicMetadata(
    buildArticlePageMetadata(article, settings, demo.title),
  );
}

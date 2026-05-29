import type { Metadata } from "next";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";

export async function buildPostPageMetadata(
  slug: string,
  id?: string,
): Promise<Metadata> {
  const article = await fetchArticleFamilyPage({ type: "post", slug, id });
  if (!article) {
    return { title: "Post Not Found" };
  }
  return buildArticleFamilyMetadata(article);
}

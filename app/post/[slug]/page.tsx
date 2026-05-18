import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import PostSelectedNews from "@/app/components/PostPage/PostSelectedNews";
import BottomArticleModule, {
  RELATED_MODULE_MODERN_TOTAL,
} from "@/app/components/PostPage/BottomArticleModule";
import { SuggestedTags } from "@/app/components/SuggestedTags";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";
import {
  loadArticlePageSidebars,
  loadLatestInCategory,
} from "@/app/lib/article-family/sidebars";
import { client } from "@/sanity/lib/client";
import { postSlugsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugsQuery);
  return (slugs as (string | null)[])
    .filter((slug): slug is string => slug != null)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string | string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { id: rawId } = await searchParams;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const article = await fetchArticleFamilyPage({ type: "post", slug, id });
  if (!article) {
    return { title: "Post Not Found" };
  }
  return buildArticleFamilyMetadata(article);
}

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const { slug } = await params;
  const { id: rawId } = await searchParams;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const article = await fetchArticleFamilyPage({ type: "post", slug, id });
  if (!article) {
    notFound();
  }

  const [{ newsForYou, popularReads, relatedArticles }, categoryLatest] =
    await Promise.all([
      loadArticlePageSidebars(article),
      loadLatestInCategory(article, RELATED_MODULE_MODERN_TOTAL),
    ]);

  const tagsForSuggested =
    article.tags
      ?.filter((tag) => tag.title && tag.slug)
      .map((tag) => ({
        name: tag.title as string,
        slug: tag.slug as string,
      })) ?? [];

  // Same-category latest (10 for modern: 6 grid + 4 sidebar). Fall back to
  // broader related when the article has no category.
  const bottomSlice = (
    categoryLatest.length > 0 ? categoryLatest : relatedArticles
  ).slice(0, RELATED_MODULE_MODERN_TOTAL);
  const categoryName = article.category?.title || undefined;
  const categoryHref = article.category?.slug
    ? `/category/${article.category.slug}`
    : undefined;

  return (
    <ArticleFamilyPage
      article={article}
      sidebar={
        <>
          <PostSelectedNews latestNews={popularReads} title="Popular Reads" />
          <PostSelectedNews latestNews={newsForYou} title="News for You" />
        </>
      }
      footer={
        <>
          <SuggestedTags tags={tagsForSuggested} />
          {bottomSlice.length > 0 && (
            <BottomArticleModule
              posts={bottomSlice}
              variant="modern"
              categoryName={categoryName}
              categoryHref={categoryHref}
            />
          )}
        </>
      }
    />
  );
}

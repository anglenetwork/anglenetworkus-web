import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import PostSelectedNews from "@/app/components/PostPage/PostSelectedNews";
import BottomArticleModule from "@/app/components/PostPage/BottomArticleModule";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";
import { loadArticlePageSidebars } from "@/app/lib/article-family/sidebars";
import { client } from "@/sanity/lib/client";
import { opinionSlugsQuery } from "@/sanity/lib/article-family-queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await client.fetch(opinionSlugsQuery);
  return (slugs as (string | null)[])
    .filter((slug): slug is string => slug != null)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleFamilyPage({ type: "opinion", slug });
  if (!article) return { title: "Not found" };
  return buildArticleFamilyMetadata(article);
}

export default async function OpinionArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticleFamilyPage({ type: "opinion", slug });
  if (!article) notFound();

  const { newsForYou, popularReads, relatedArticles } =
    await loadArticlePageSidebars(article);
  const bottomSlice = relatedArticles.slice(0, 8);

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
        bottomSlice.length > 0 ? (
          <BottomArticleModule posts={bottomSlice} />
        ) : null
      }
    />
  );
}

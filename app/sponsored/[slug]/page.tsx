import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import PostSelectedNews from "@/app/components/PostPage/PostSelectedNews";
import { SuggestedTags } from "@/app/components/SuggestedTags";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";
import { loadArticlePageSidebars } from "@/app/lib/article-family/sidebars";
import { client } from "@/sanity/lib/client";
import { sponsoredSlugsQuery } from "@/sanity/lib/article-family-queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await client.fetch(sponsoredSlugsQuery);
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
  const article = await fetchArticleFamilyPage({ type: "sponsored", slug });
  if (!article) return { title: "Not found" };
  return buildArticleFamilyMetadata(article);
}

export default async function SponsoredArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticleFamilyPage({ type: "sponsored", slug });
  if (!article) notFound();

  const { newsForYou, popularReads } = await loadArticlePageSidebars(article);

  const tagsForSuggested =
    article.tags
      ?.filter((tag) => tag.title && tag.slug)
      .map((tag) => ({
        name: tag.title as string,
        slug: tag.slug as string,
      })) ?? [];

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
        tagsForSuggested.length > 0 ? (
          <SuggestedTags tags={tagsForSuggested} />
        ) : null
      }
    />
  );
}

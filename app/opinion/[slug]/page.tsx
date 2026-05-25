import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import BottomArticleModule from "@/app/components/PostPage/BottomArticleModule";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";
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

  return (
    <ArticleFamilyPage
      article={article}
      footer={({ relatedArticles }) => {
        const bottomSlice = relatedArticles.slice(0, 8);

        return bottomSlice.length > 0 ? (
          <BottomArticleModule posts={bottomSlice} />
        ) : null;
      }}
    />
  );
}

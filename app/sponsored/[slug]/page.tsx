import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleFamilyPage from "@/app/components/article-family/ArticleFamilyPage";
import { SuggestedTags } from "@/app/components/SuggestedTags";
import { fetchArticleFamilyPage } from "@/app/lib/article-family/fetch";
import { buildArticleFamilyMetadata } from "@/app/lib/article-family/metadata";
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

  const tagsForSuggested =
    article.tags?.reduce<Array<{ name: string; slug: string }>>((acc, tag) => {
      if (tag.title && tag.slug) {
        acc.push({ name: tag.title, slug: tag.slug });
      }
      return acc;
    }, []) ?? [];

  return (
    <ArticleFamilyPage
      article={article}
      footer={
        tagsForSuggested.length > 0 ? (
          <SuggestedTags tags={tagsForSuggested} />
        ) : null
      }
    />
  );
}

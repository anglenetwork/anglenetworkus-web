import type { Metadata } from "next";
import { RenderPostPage, buildPostPageMetadata } from "./render-post-page";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { postPublishedSlugsQuery } from "@/sanity/lib/article-family-queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetchStatic({
    query: postPublishedSlugsQuery,
  });
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
  return buildPostPageMetadata(slug);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <RenderPostPage slug={slug} />;
}

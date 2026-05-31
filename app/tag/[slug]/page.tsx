import { notFound, redirect } from "next/navigation";
import { after } from "next/server";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import {
  tagBySlugQuery,
  postsByTagQuery,
  tagSlugsQuery,
  popularReadsFallbackQuery,
} from "@/sanity/lib/queries";
import {
  fetchRankingRowsForArticleIds,
  sortIdsByRankingThenPublishedAt,
} from "@/app/lib/article-family/metrics";
import { logDevMetricsFallback } from "@/app/lib/article-family/metrics-dev-log";
import { editorialTagArticleCountQuery } from "@/sanity/lib/article-family-queries";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildTagPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { trackTagView } from "@/app/lib/analytics/track-tag-view";
import ShowMoreSection from "./ShowMoreSection";
import { TagMainSection, type TagMainPost } from "./components/TagMainSection";

// Revalidate this page every 60s
export const revalidate = 60;

// Generate static params for SSG
export async function generateStaticParams() {
  const tags = await client.fetch(tagSlugsQuery);
  return tags
    .filter((tag: any) => tag.slug !== null)
    .map((tag: any) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [tag, countRaw, settings] = await Promise.all([
    sanityFetch({
      query: tagBySlugQuery,
      params: { slug },
    }),
    sanityFetch({
      query: editorialTagArticleCountQuery,
      params: { tagSlug: slug },
    }),
    getCachedSettings(),
  ]);

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const title = tag.title ?? "Tag";
  const resultCount = typeof countRaw === "number" ? countRaw : 0;

  return finalizePublicMetadata(
    buildTagPageMetadata({
      tagTitle: title,
      resultCount,
      settings,
      demoTitle: demo.title,
      slug,
    }),
  );
}

async function getTagData(slug: string) {
  // Get the tag data
  const tag = await sanityFetch({
    query: tagBySlugQuery,
    params: { slug },
  });

  if (!tag) {
    return null;
  }

  // Handle deprecated tags with redirects
  if (tag.deprecated && tag.redirectTo?.slug) {
    redirect(`/tag/${tag.redirectTo.slug}`);
  }

  const postsRaw = await sanityFetch({
    query: postsByTagQuery,
    params: { tagSlug: slug },
  });

  const editorial = (postsRaw || []) as Array<{
    _id: string;
    _type: string;
    publishedAt?: string | null;
    tags?: Array<{ slug?: string | null }>;
  }>;

  const postOnly = editorial.filter((p) => p._type === "post");
  const metricsMap = await fetchRankingRowsForArticleIds(
    postOnly.map((p) => p._id),
  );
  const sortedByMetrics = sortIdsByRankingThenPublishedAt(postOnly, metricsMap);
  const hasMetricViews = sortedByMetrics.some(
    (p) => (metricsMap.get(p._id)?.views7d ?? 0) > 0,
  );

  let popularReads: unknown[] = sortedByMetrics.slice(0, 5);
  if (!hasMetricViews || popularReads.length === 0) {
    logDevMetricsFallback("tag_page_popular", "empty_or_no_activity");
    const fallback = await client.fetch(popularReadsFallbackQuery, {
      currentPostId: "",
    });
    popularReads = (
      fallback as Array<{ tags?: Array<{ slug?: string }> }>
    ).filter((post) => post.tags?.some((t) => t.slug === slug));
  }

  const popularIds = (popularReads as { _id: string }[]).map((p) => p._id);
  const popularMetrics = await fetchRankingRowsForArticleIds(popularIds);
  const popularReadsWithViews = (popularReads as Record<string, unknown>[]).map(
    (p) => ({
      ...p,
      views7d: popularMetrics.get(String(p._id))?.views7d ?? 0,
    }),
  );

  const allMetrics = await fetchRankingRowsForArticleIds(
    editorial.map((p) => p._id),
  );
  const postsWithViews = editorial.map((p) => ({
    ...p,
    views7d: allMetrics.get(p._id)?.views7d ?? 0,
  }));

  return {
    tag,
    posts: postsWithViews,
    popularReads: popularReadsWithViews,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getTagData(slug);

  if (!data) {
    notFound();
  }

  after(() => trackTagView(slug));

  const { tag, posts: rawPosts } = data;

  const posts = (rawPosts as Record<string, unknown>[]).map((p) => ({
    ...p,
    href: articleFamilyHref(
      ((p._type as ArticleFamilyDocType) || "post") as ArticleFamilyDocType,
      String(p.slug ?? "#"),
    ),
  })) as Array<TagMainPost & Record<string, unknown>>;

  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, 5);
  const remainingPosts = posts.slice(5);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: tag.title || "Tag", path: `/tag/${slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <main className="min-h-screen bg-background py-4 md:py-8">
        <SitePageWidth>
          {featuredPost ? (
            <TagMainSection
              tagTitle={tag.title || "Tag"}
              featuredPost={featuredPost}
              sidebarPosts={sidebarPosts}
            />
          ) : null}
        </SitePageWidth>

        {remainingPosts.length > 0 ? (
          <ShowMoreSection posts={remainingPosts as any} tagSlug={slug} />
        ) : null}
      </main>
    </>
  );
}

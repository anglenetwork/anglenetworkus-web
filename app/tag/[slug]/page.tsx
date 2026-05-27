import { notFound, redirect } from "next/navigation";
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
import { jsonLdScriptContent } from "@/app/lib/article-family/structured-data";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildTagPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import { getCoverImage } from "@/sanity/lib/utils";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { SectionHeader } from "@/app/components/ui/section-header";
import ShowMoreSection from "./ShowMoreSection";
import TagViewTracker from "./TagViewTracker";
import { TagFeaturedArticle } from "./components/TagFeaturedArticle";
import { TagArticleItem } from "./components/TagArticleItem";
import { TagNewsItem } from "./components/TagNewsItem";
import { TagTextNewsItem } from "./components/TagTextNewsItem";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

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

  const { tag, posts: rawPosts, popularReads } = data;

  const posts = (rawPosts as Record<string, unknown>[]).map((p) => ({
    ...p,
    href: articleFamilyHref(
      ((p._type as ArticleFamilyDocType) || "post") as ArticleFamilyDocType,
      String(p.slug ?? "#"),
    ),
  })) as Array<
    Record<string, unknown> & {
      href: string;
      _id: string;
      slug?: string | null;
      title?: string | null;
      cover?: unknown;
    }
  >;

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: tag.title || "Tag", path: `/tag/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(breadcrumbLd),
        }}
      />
      <main className="min-h-screen bg-background py-4 md:py-8">
        <TagViewTracker tagSlug={slug} />
        <SitePageWidth>
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left Column - 60% */}
            <div className="w-full lg:w-[60%]">
              <SectionHeader
                title={tag.title || "Tag"}
                variant="light"
                accentStyle="geometric-square"
                size="large"
              />

              {/* Featured Article */}
              {posts.length > 0 &&
                (() => {
                  const coverData = getCoverImage(
                    posts[0].cover as {
                      source?: "asset" | "external";
                      externalUrl?: string | null;
                      image?: any;
                      alt?: string | null;
                    } | null,
                    posts[0].title || "Featured article",
                  );
                  return (
                    <TagFeaturedArticle
                      image={coverData?.src || ""}
                      imageAlt={
                        coverData?.alt || posts[0].title || "Featured article"
                      }
                      imageUnoptimized={coverData?.unoptimized}
                      title={posts[0].title || "Untitled"}
                      slug={posts[0].slug || "#"}
                      href={posts[0].href}
                    />
                  );
                })()}

              <div className="space-y-2 divide-y divide-border border-t pt-4">
                {posts.slice(1, 4).map((post) => {
                  const coverData = getCoverImage(
                    post.cover as {
                      source?: "asset" | "external";
                      externalUrl?: string | null;
                      image?: any;
                      alt?: string | null;
                    } | null,
                    post.title || "Untitled",
                  );
                  return (
                    <TagArticleItem
                      key={post._id}
                      image={coverData?.src || "/placeholder.svg"}
                      imageUnoptimized={coverData?.unoptimized}
                      title={post.title || "Untitled"}
                      slug={post.slug || "#"}
                      href={post.href}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right Column - 40% */}
            <aside className="w-full pt-0 lg:w-[40%] lg:pt-10">
              <div className="space-y-0 rounded-xl bg-black p-4">
                {popularReads.slice(0, 4).map((post: any, index: number) => {
                  const coverData = getCoverImage(
                    post.cover as {
                      source?: "asset" | "external";
                      externalUrl?: string | null;
                      image?: any;
                      alt?: string | null;
                    } | null,
                    post.title || "Untitled",
                  );
                  return (
                    <div key={post._id}>
                      <TagNewsItem
                        image={coverData?.src || "/placeholder.svg"}
                        imageUnoptimized={coverData?.unoptimized}
                        title={post.title || "Untitled"}
                        readTime={`${post.readTime || 3} MIN READ`}
                        slug={post.slug || "#"}
                      />
                      {index < 3 && <div className="border-border border-b" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 rounded-lg bg-neutral-100 p-8">
                <SectionHeader
                  title="More News"
                  variant="light"
                  accentStyle="geometric-square"
                  size="large"
                />
                <div className="space-y-0 divide-y divide-border">
                  {posts.slice(4, 8).map((post) => (
                    <TagTextNewsItem
                      key={post._id}
                      title={post.title || "Untitled"}
                      slug={post.slug || "#"}
                      href={post.href}
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </SitePageWidth>

        <ShowMoreSection posts={posts as any} tagSlug={slug} />
      </main>
    </>
  );
}

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
import { trackTagView } from "@/app/lib/analytics/track-tag-view";
import { getCoverImage } from "@/sanity/lib/utils";
import ShowMoreSection from "./ShowMoreSection";
import { TagHeroGrid } from "./components/TagHeroGrid";
import { TagIcymiSection } from "./components/TagIcymiSection";
import { TagPageHeader } from "./components/TagPageHeader";
import {
  formatTagItemNumber,
  type TagIcymiItem,
  type TagPost,
} from "./components/types";

/** Featured hero + sidebar rows in TagHeroGrid (1 featured + this many sidebar). */
const TAG_MAIN_SIDEBAR_POST_COUNT = 3;

/** ICYMI grid after the hero block. */
const TAG_MISSED_IT_COUNT = 4;

type RawTagPost = TagPost &
  Record<string, unknown> & {
    _type?: string;
    excerpt?: string | null;
    date?: string;
    author?: unknown;
    category?: unknown;
    views7d?: number | null;
  };

function formatTagImageCredit(cover: TagPost["cover"]): string | null {
  if (!cover) return null;
  const author = cover.creditAuthor?.trim();
  const source = cover.creditSource?.trim();
  if (author && source) return `${author} / ${source}`;
  if (source) return source;
  if (author) return author;
  return null;
}

function postToIcymiItem(post: RawTagPost, numberIndex: number): TagIcymiItem {
  const coverData = getCoverImage(
    post.cover as Parameters<typeof getCoverImage>[0],
    post.title || "Article image",
  );

  return {
    id: post._id,
    number: formatTagItemNumber(numberIndex),
    title: post.title || "Untitled",
    href: post.href,
    imageUrl: coverData?.src ?? "",
    imageAlt: coverData?.alt,
    imageUnoptimized: coverData?.unoptimized,
    imageCredit: formatTagImageCredit(post.cover),
    readTimeMinutes: post.readTime,
  };
}

// Revalidate this page every 60s
export const revalidate = 60;

// Generate static params for SSG
export async function generateStaticParams() {
  const tags = await client.fetch(tagSlugsQuery);
  return tags
    .filter((tag: { slug: string | null }) => tag.slug !== null)
    .map((tag: { slug: string | null }) => ({ slug: tag.slug! }));
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
  const tag = await sanityFetch({
    query: tagBySlugQuery,
    params: { slug },
  });

  if (!tag) {
    return null;
  }

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
    title: (p.title as string | null) || "Untitled",
    slug: String(p.slug ?? ""),
    href: articleFamilyHref(
      ((p._type as ArticleFamilyDocType) || "post") as ArticleFamilyDocType,
      String(p.slug ?? "#"),
    ),
  })) as RawTagPost[];

  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, 1 + TAG_MAIN_SIDEBAR_POST_COUNT);
  const missedItStart = 1 + TAG_MAIN_SIDEBAR_POST_COUNT;
  const missedItPosts = posts.slice(
    missedItStart,
    missedItStart + TAG_MISSED_IT_COUNT,
  );
  const latestPosts = posts.slice(missedItStart + TAG_MISSED_IT_COUNT);
  const tagTitle = tag.title || "Tag";

  const icymiItems = missedItPosts.map((post, index) =>
    postToIcymiItem(post, missedItStart + index - 1),
  );

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: tag.title || "Tag", path: `/tag/${slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <div className="min-h-screen bg-news-surface">
        <TagPageHeader tagTitle={tagTitle} />

        {featuredPost ? (
          <TagHeroGrid
            featuredPost={featuredPost}
            sidebarPosts={sidebarPosts}
          />
        ) : null}

        {icymiItems.length > 0 ? <TagIcymiSection items={icymiItems} /> : null}

        {latestPosts.length > 0 ? (
          <ShowMoreSection posts={latestPosts as any} tagTitle={tagTitle} />
        ) : null}
      </div>
    </>
  );
}

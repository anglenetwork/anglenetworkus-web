import { notFound } from "next/navigation";
import { after } from "next/server";
import type { Metadata } from "next";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categorySlugsQuery,
  postsByCategoryQuery,
} from "@/sanity/lib/queries";
import {
  fetch10DayViewsForArticleIds,
  sortIdsBy10DayViewsThenPublishedAt,
} from "@/app/lib/article-family/metrics";
import {
  buildCategoryFeaturedArticles,
  buildCategoryHeadlineRowArticles,
  buildCategoryLatestArticles,
  buildCategoryMissedItArticles,
  buildCategoryTickerPosts,
} from "@/app/lib/category-page/layout-sections";
import { CategoryPage } from "@/app/components/CategoryPage";
import type { Article } from "@/app/components/CategoryPage/types";
import { formatImageCredit, getCoverImage } from "@/sanity/lib/utils";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildCategoryPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import { trackCategoryView } from "@/app/lib/analytics/track-category-view";
import { getTagsGlimpseData } from "@/app/lib/tags-glimpse/get-tags-glimpse-data";

// Generate static params for SSG
export async function generateStaticParams() {
  const categories = await sanityFetchStatic({ query: categorySlugsQuery });
  return categories
    .filter((category: any) => category.slug !== null)
    .map((category: any) => ({
      slug: category.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const [categoryData, posts, settings] = await Promise.all([
    sanityFetchStatic({
      query: `*[_type == "category" && slug.current == $slug][0]{name, slug}`,
      params: { slug },
    }),
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: slug },
    }),
    getCachedSettings(),
  ]);

  const categoryName =
    categoryData?.name ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const resultCount = Array.isArray(posts) ? posts.length : 0;

  return finalizePublicMetadata(
    buildCategoryPageMetadata({
      categoryName,
      resultCount,
      settings,
      demoTitle: demo.title,
      slug,
    }),
  );
}

export default async function CategoryPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categoryData, posts, tagsGlimpse] = await Promise.all([
    sanityFetchStatic({
      query: `*[_type == "category" && slug.current == $slug][0]{name, slug}`,
      params: { slug },
    }),
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: slug },
    }),
    getTagsGlimpseData(slug),
  ]);

  const postList = Array.isArray(posts) ? posts : [];

  const views10d = await fetch10DayViewsForArticleIds(
    postList.map((p: { _id: string }) => p._id),
  );
  const mostReadSorted = sortIdsBy10DayViewsThenPublishedAt(
    postList as { _id: string; publishedAt?: string | null }[],
    views10d,
  );
  const mostViewed = mostReadSorted.slice(0, 5);

  if (!categoryData) {
    notFound();
  }

  after(() => trackCategoryView(slug));

  const categoryName =
    categoryData.name ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const transformPostToArticle = (post: any): Article => {
    const coverData = getCoverImage(post.cover, post.title || "Article image");
    const slug = post.slug || "#";
    const t = (post._type as ArticleFamilyDocType | undefined) ?? "post";

    return {
      id: post._id,
      title: post.title || "Untitled",
      excerpt: post.excerpt || "",
      author: post.author?.name || "Anonymous",
      publishedAt:
        post.publishedAt ??
        post.updatedAt ??
        post.date ??
        post._updatedAt ??
        "",
      readTime: typeof post.readTime === "number" ? post.readTime : null,
      category: post.category?.title || categoryName,
      imageUrl: coverData?.src,
      imageAlt: coverData?.alt,
      imageCredit: formatImageCredit(post.cover) ?? undefined,
      imageUnoptimized: coverData?.unoptimized,
      slug,
      href: articleFamilyHref(t, slug),
    };
  };

  const mostReadArticles = (mostViewed || [])
    .slice(0, 5)
    .map(transformPostToArticle);

  const n = postList.length;
  const hasPosts = n > 0;

  const headlineRowArticles = buildCategoryHeadlineRowArticles(
    postList,
    transformPostToArticle,
  );

  const categoryTickerPosts = buildCategoryTickerPosts(postList);

  const missedItArticles = buildCategoryMissedItArticles(
    postList,
    transformPostToArticle,
  );

  const latestArticles = buildCategoryLatestArticles(
    postList,
    transformPostToArticle,
  );

  const featuredArticles = buildCategoryFeaturedArticles(
    postList,
    transformPostToArticle,
  );

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: categoryName, path: `/category/${slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <CategoryPage
        categoryName={categoryName}
        hasPosts={hasPosts}
        latestArticles={latestArticles}
        mostReadArticles={mostReadArticles}
        headlineRowArticles={headlineRowArticles}
        missedItArticles={missedItArticles}
        tagsGlimpse={tagsGlimpse ?? undefined}
        featuredArticles={featuredArticles}
        categoryTickerPosts={categoryTickerPosts}
      />
    </>
  );
}

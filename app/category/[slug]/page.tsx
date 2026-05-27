import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categorySlugsQuery,
  postsByCategoryQuery,
  categoryTickerQuery,
} from "@/sanity/lib/queries";
import {
  fetchRankingRowsForArticleIds,
  sortIdsByRankingThenPublishedAt,
} from "@/app/lib/article-family/metrics";
import { CategoryPage } from "@/app/components/CategoryPage";
import type { Article } from "@/app/components/CategoryPage/types";
import { formatImageCredit, getCoverImage } from "@/sanity/lib/utils";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { jsonLdScriptContent } from "@/app/lib/article-family/structured-data";
import { buildBreadcrumbJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildCategoryPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";

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

  const [categoryData, posts, categoryTickerPosts] = await Promise.all([
    sanityFetchStatic({
      query: `*[_type == "category" && slug.current == $slug][0]{name, slug}`,
      params: { slug },
    }),
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: slug },
    }),
    sanityFetchStatic({
      query: categoryTickerQuery,
      params: { categorySlug: slug },
    }),
  ]);

  const postList = Array.isArray(posts) ? posts : [];

  const metricsMap = await fetchRankingRowsForArticleIds(
    postList.map((p: { _id: string }) => p._id),
  );
  const mostViewedSorted = sortIdsByRankingThenPublishedAt(
    postList as { _id: string; publishedAt?: string | null }[],
    metricsMap,
  );
  const mostViewed = mostViewedSorted.slice(0, 5);

  if (!categoryData) {
    notFound();
  }

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
      readTime: "5 min read",
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

  const latestArticles =
    n >= 5
      ? postList.slice(5).map(transformPostToArticle)
      : n >= 1
        ? postList.map(transformPostToArticle)
        : [];

  let featuredArticles:
    | {
        leftColumn: Article[];
        centerArticle: Article;
        rightColumn: Article[];
      }
    | undefined = undefined;

  if (n >= 5) {
    featuredArticles = {
      leftColumn: postList.slice(1, 3).map(transformPostToArticle),
      centerArticle: transformPostToArticle(postList[0]),
      rightColumn: postList.slice(3, 5).map(transformPostToArticle),
    };
  }

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: categoryName, path: `/category/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(breadcrumbLd),
        }}
      />
      <CategoryPage
        categoryName={categoryName}
        hasPosts={hasPosts}
        latestArticles={latestArticles}
        mostReadArticles={mostReadArticles}
        featuredArticles={featuredArticles}
        categoryTickerPosts={categoryTickerPosts as any}
      />
    </>
  );
}

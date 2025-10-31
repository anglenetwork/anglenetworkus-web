import { notFound } from "next/navigation";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categorySlugsQuery,
  postsByCategoryQuery,
  mostViewedQuery,
} from "@/sanity/lib/queries";
import { CategoryPage } from "@/app/components/CategoryPage";
import { getCoverImage } from "@/sanity/lib/utils";

// Generate static params for SSG
export async function generateStaticParams() {
  const categories = await sanityFetchStatic({ query: categorySlugsQuery });
  return categories
    .filter((category) => category.slug !== null)
    .map((category) => ({
      slug: category.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch category details and posts for better metadata
  const [categoryData, posts, mostViewed] = await Promise.all([
    sanityFetchStatic({
      query: `*[_type == "category" && slug.current == $slug][0]{name, slug}`,
      params: { slug },
    }),
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: slug },
    }),
    sanityFetchStatic({
      query: mostViewedQuery,
      params: { categorySlug: slug },
    }),
  ]);

  const categoryName =
    categoryData?.name ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return {
    title: `${categoryName} | News Blog`,
    description: `Latest news and articles in the ${categoryName} category. ${posts.length} articles available.`,
    openGraph: {
      title: `${categoryName} | News Blog`,
      description: `Latest news and articles in the ${categoryName} category.`,
      type: "website",
    },
  };
}

export default async function CategoryPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch category data and posts
  const [categoryData, posts, mostViewed] = await Promise.all([
    sanityFetchStatic({
      query: `*[_type == "category" && slug.current == $slug][0]{name, slug}`,
      params: { slug },
    }),
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: slug },
    }),
    sanityFetchStatic({
      query: mostViewedQuery,
      params: { categorySlug: slug },
    }),
  ]);

  // If category doesn't exist, show 404
  if (!categoryData) {
    notFound();
  }

  const categoryName =
    categoryData.name ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Transform posts to Article format
  const transformPostToArticle = (post: any) => {
    const coverData = getCoverImage(post.cover, post.title || "Article image");
    return {
      id: post._id,
      title: post.title || "Untitled",
      excerpt: post.excerpt || "",
      author: post.author?.name || "Anonymous",
      publishedAt: post.date || post._updatedAt,
      readTime: "5 min read", // You can calculate this based on content length
      category: post.category?.title || categoryName,
      imageUrl: coverData?.src,
      imageUnoptimized: coverData?.unoptimized,
      slug: post.slug || "#",
    };
  };

  // Organize articles according to the new structure:
  // Featured articles: posts 0-4 (latest 5 articles)
  // Latest articles: posts 5+ (from 6th article onwards)

  const mostReadArticles = (mostViewed || [])
    .slice(0, 5)
    .map(transformPostToArticle);
  const latestArticles = posts.slice(5).map(transformPostToArticle); // From 6th article onwards

  // Create featured articles if we have enough posts (at least 5)
  let featuredArticles = undefined;
  if (posts.length >= 5) {
    featuredArticles = {
      leftColumn: posts.slice(1, 3).map(transformPostToArticle), // 2nd and 3rd latest (posts 1 and 2)
      centerArticle: transformPostToArticle(posts[0]), // Latest article (post 0)
      rightColumn: posts.slice(3, 5).map(transformPostToArticle), // 4th and 5th latest (posts 3 and 4)
    };
  }

  return (
    <CategoryPage
      categoryName={categoryName}
      categoryDescription={`Stay updated with the latest news and insights in the ${categoryName} category.`}
      latestArticles={latestArticles}
      mostReadArticles={mostReadArticles}
      featuredArticles={featuredArticles}
    />
  );
}

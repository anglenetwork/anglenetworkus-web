import { notFound } from "next/navigation";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  categorySlugsQuery,
  postsByCategoryQuery,
  mostViewedQuery,
  categoryTickerQuery,
} from "@/sanity/lib/queries";
import { CategoryPage } from "@/app/components/CategoryPage";
import { getCoverImage } from "@/sanity/lib/utils";

// Keep this in sync with the client Article type shape
interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl?: string;
  imageUnoptimized?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  imageBlurDataURL?: string;
  slug: string;
}

// Generate static params for SSG
export async function generateStaticParams() {
  const categories = await sanityFetchStatic({ query: categorySlugsQuery });
  return categories
    .filter((category: any) => category.slug !== null)
    .map((category: any) => ({
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

  const [categoryData, posts, mostViewed, categoryTickerPosts] = await Promise.all([
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
    sanityFetchStatic({
      query: categoryTickerQuery,
      params: { categorySlug: slug },
    }),
  ]);

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

    return {
      id: post._id,
      title: post.title || "Untitled",
      excerpt: post.excerpt || "",
      author: post.author?.name || "Anonymous",
      publishedAt: post.date || post._updatedAt,
      readTime: "5 min read",
      category: post.category?.title || categoryName,
      imageUrl: coverData?.src,
      imageUnoptimized: coverData?.unoptimized,
      slug: post.slug || "#",
    };
  };

  const mostReadArticles = (mostViewed || [])
    .slice(0, 5)
    .map(transformPostToArticle);

  const latestArticles = posts.slice(5).map(transformPostToArticle);

  let featuredArticles:
    | {
        leftColumn: Article[];
        centerArticle: Article;
        rightColumn: Article[];
      }
    | undefined = undefined;

  if (posts.length >= 5) {
    featuredArticles = {
      leftColumn: posts.slice(1, 3).map(transformPostToArticle),
      centerArticle: transformPostToArticle(posts[0]),
      rightColumn: posts.slice(3, 5).map(transformPostToArticle),
    };
  }

  return (
    <CategoryPage
      categoryName={categoryName}
      // categoryDescription={`Stay updated with the latest news and insights in the ${categoryName} category.`}
      latestArticles={latestArticles}
      mostReadArticles={mostReadArticles}
      featuredArticles={featuredArticles}
      categoryTickerPosts={categoryTickerPosts as any}
    />
  );
}

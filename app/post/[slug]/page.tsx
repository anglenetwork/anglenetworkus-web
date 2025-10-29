import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { urlForImage } from "@/sanity/lib/utils";
import PostHeader from "@/app/components/PostPage/PostHeader";
import PostBody from "@/app/components/PostPage/PostBody";
import PostSelectedNews from "@/app/components/PostPage/PostSelectedNews";
import PostSelectedNewsAlt from "@/app/components/PostPage/PostSelectedNewsAlt";
import BottomArticleModule from "@/app/components/PostPage/BottomArticleModule";
import { SuggestedTags } from "@/app/components/SuggestedTags";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import {
  postSlugsQuery,
  postBySlugQuery,
  postQueryWithRelated,
  postQueryWithCategoryRelated,
  latestNews4Query,
  popularReadsTrendingQuery,
  popularReadsFallbackQuery,
} from "@/sanity/lib/queries";
import TrackViewClient from "./TrackViewClient";
import CategoryViewTracker from "./CategoryViewTracker";

// page.tsx (add near the top, after imports)
type HeaderCategory = { title: string; slug: string };
type HeaderAuthor = { name: string; picture?: any };

function toHeaderCategory(cat: unknown): HeaderCategory | undefined {
  if (
    cat &&
    typeof (cat as any).title === "string" &&
    typeof (cat as any).slug === "string"
  ) {
    return cat as HeaderCategory;
  }
  return undefined;
}

function toHeaderAuthor(a: unknown): HeaderAuthor | undefined {
  if (a && typeof (a as any).name === "string") {
    const { name, picture } = a as { name: string; picture?: any };
    return picture ? { name, picture } : { name };
  }
  return undefined;
}

// Revalidate this page every 60s
export const revalidate = 60;

// Generate static params for SSG
export async function generateStaticParams() {
  const slugs = await client.fetch(postSlugsQuery);
  return slugs
    .filter((slug: string | null): slug is string => slug !== null)
    .map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const title = post.title ?? "Post";
  const description = post.excerpt ?? "";

  let image: string | undefined;
  const builder = urlForImage(post.coverImage);
  if (builder) {
    image = builder.width(1200).height(627).fit("crop").url();
  }

  return {
    title: `${title} | News Blog`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "article",
      publishedTime: post.date,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

async function getPostData(slug: string) {
  // First, get the post to determine its category
  const postData = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
  });

  // Fetch sidebar rails in parallel (independent of category presence)
  const [latestOverall, trendingReads] = await Promise.all([
    client.fetch(latestNews4Query, { currentPostId: postData._id }),
    client.fetch(popularReadsTrendingQuery, { currentPostId: postData._id }),
  ]);

  // Use fallback if no trending data or all posts have 0 views
  const hasViews = trendingReads?.some((post: any) => post.views7d > 0);
  console.log("Trending reads raw data:", trendingReads);
  console.log("Has views check:", hasViews);

  const popularReads = hasViews
    ? trendingReads
    : await client.fetch(popularReadsFallbackQuery, {
        currentPostId: postData._id,
      });

  if (!postData || !postData.category) {
    // Fallback to general related articles if no category
    const data = await sanityFetch({
      query: postQueryWithRelated,
      params: { slug },
    });

    return {
      post: data.post,
      latestNews: data.latestNews || [],
      newsForYou: latestOverall || [],
      popularReads: popularReads || [],
      nextArticles: data.nextArticles || [],
    };
  }

  // Get category-specific articles
  const data = await sanityFetch({
    query: postQueryWithCategoryRelated,
    params: {
      slug,
      categorySlug: postData.category.slug,
    },
  });

  return {
    post: data.post,
    latestNews: data.latestNews || [],
    newsForYou: latestOverall || [],
    popularReads: popularReads || [],
    nextArticles: data.categoryArticles || [],
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post, latestNews, newsForYou, popularReads, nextArticles } =
    await getPostData(slug);

  if (!post) {
    notFound();
  }

  // Filter out posts with null slugs for the sidebar components
  const validLatestNews = latestNews.filter(
    (post) => post.slug !== null
  ) as any[];
  const validNewsForYou = newsForYou.filter(
    (post) => post.slug !== null
  ) as any[];
  const validPopularReads = popularReads.filter(
    (post) => post.slug !== null
  ) as any[];
  const validNextArticles = nextArticles.filter(
    (post) => post.slug !== null
  ) as any[];

  // Debug: Log post data
  console.log("Post data:", { _id: post._id, title: post.title });
  console.log("Popular reads data:", popularReads);
  console.log(
    "Has views:",
    popularReads?.some((p: any) => p.views7d > 0)
  );
  console.log(
    "View counts:",
    popularReads?.map((p: any) => ({
      title: p.title,
      hasViews: p.hasViews,
      views7d: p.views7d,
      views30d: p.views30d,
      viewsAll: p.viewsAll,
      totalScore: p.totalScore,
    }))
  );

  return (
    <div className="min-h-screen">
      {/* Track view (client) */}
      <TrackViewClient postId={post._id} />

      {/* Track category view (client) */}
      {post.category?.slug && (
        <CategoryViewTracker categorySlug={post.category.slug} />
      )}

      <div className="container mx-auto px-4 lg:px-40 py-4 border-2 border-lime-500">
        <article className="mt-4 lg:mt-8">
          {/* <PostHeader
            category={
              post.category && post.category.title && post.category.slug
                ? {
                    title: post.category.title,
                    slug: post.category.slug,
                  }
                : undefined
            }
            title={post.title || "Untitled"}
            excerpt={post.excerpt || undefined}
            date={post.date}
            author={post.author}
            slug={post.slug || undefined}
          /> */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">
            <div className="col-span-1 lg:col-span-8">
              <PostHeader
                category={
                  post.category && post.category.title && post.category.slug
                    ? {
                        title: post.category.title,
                        slug: post.category.slug,
                      }
                    : undefined
                }
                title={post.title || "Untitled"}
                excerpt={post.excerpt || undefined}
                date={post.date}
                author={post.author}
                slug={post.slug || undefined}
              />
              <PostBody
                bodyTextOne={post.bodyTextOne}
                bodyTextTwo={post.bodyTextTwo}
                bodyTextThree={post.bodyTextThree}
                bodyTextFour={post.bodyTextFour}
                bodyTextFive={post.bodyTextFive}
                coverImage={post.coverImage}
                title={post.title || "Untitled"}
                epigraph={post.epigraph}
                imageSource={post.imageSource}
                bodyImageOne={post.bodyImageOne}
                bodyImageTwo={post.bodyImageTwo}
                bodyImageThree={post.bodyImageThree}
                bodyImageFour={post.bodyImageFour}
                bodyImageFive={post.bodyImageFive}
                bodyImages={post.bodyImages}
                author={post.author}
                date={post.date}
                slug={post.slug || undefined}
              />
            </div>
            <div className="flex flex-col col-span-1 lg:col-span-4 gap-8">
              {/* Popular Reads (trending) */}
              <PostSelectedNews
                latestNews={validPopularReads}
                title="Popular Reads"
              />
              {/* News for You (latest overall) */}
              <PostSelectedNews
                latestNews={validNewsForYou}
                title="News for You"
              />
              {/* <PostSelectedNewsAlt
                latestNews={validLatestNews}
                title="Trending"
              /> */}
            </div>
          </div>
        </article>

        {/* Suggested Tags */}
        <SuggestedTags
          tags={
            post.tags
              ?.filter((tag: any) => tag.title && tag.slug)
              .map((tag: any) => ({
                name: tag.title as string,
                slug: tag.slug as string,
              })) || []
          }
        />

        {validNextArticles.length > 0 && (
          <BottomArticleModule posts={validNextArticles} />
        )}
      </div>
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import {
  tagBySlugQuery,
  postsByTagQuery,
  tagSlugsQuery,
  popularReadsTrendingQuery,
  popularReadsFallbackQuery,
} from "@/sanity/lib/queries";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import ShowMoreSection from "./ShowMoreSection";
import TagViewTracker from "./TagViewTracker";
import { TagFeaturedArticle } from "./components/TagFeaturedArticle";
import { TagArticleItem } from "./components/TagArticleItem";
import { TagNewsItem } from "./components/TagNewsItem";
import { TagTextNewsItem } from "./components/TagTextNewsItem";

// Revalidate this page every 60s
export const revalidate = 60;

// Generate static params for SSG
export async function generateStaticParams() {
  const tags = await client.fetch(tagSlugsQuery);
  return tags
    .filter((tag: any) => tag.slug !== null)
    .map((tag: any) => ({ slug: tag.slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await sanityFetch({
    query: tagBySlugQuery,
    params: { slug },
  });

  if (!tag) {
    return {
      title: "Tag Not Found",
    };
  }

  const title = tag.title ?? "Tag";
  const description = tag.description ?? `Posts tagged with ${title}`;

  return {
    title: `${title} | News Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
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

  // Fetch all posts with this tag
  const posts = await sanityFetch({
    query: postsByTagQuery,
    params: { tagSlug: slug },
  });

  // Fetch trending posts for this tag
  const trendingPosts = await client.fetch(popularReadsTrendingQuery, {
    currentPostId: null,
  });

  // Filter trending posts to only include those with this tag
  const tagTrendingPosts = trendingPosts.filter((post: any) =>
    post.tags?.some((tag: any) => tag.slug === slug)
  );

  // Use fallback if no trending data
  const hasViews = tagTrendingPosts?.some((post: any) => post.views7d > 0);
  const popularReads = hasViews
    ? tagTrendingPosts
    : await client.fetch(popularReadsFallbackQuery, {
        currentPostId: null,
      });

  return {
    tag,
    posts: posts || [],
    popularReads: popularReads || [],
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

  const { tag, posts, popularReads } = data;

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <TagViewTracker tagSlug={slug} />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
        {/* Left Column - 60% */}
        <div className="w-full lg:w-[60%]">
          <SectionHeader
            title={tag.title || "Tag"}
            variant="light"
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
                posts[0].title || "Featured article"
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
                post.title || "Untitled"
              );
              return (
                <TagArticleItem
                  key={post._id}
                  image={coverData?.src || "/placeholder.svg"}
                  imageUnoptimized={coverData?.unoptimized}
                  title={post.title || "Untitled"}
                  slug={post.slug || "#"}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column - 40% */}
        <aside className="w-full pt-0 lg:w-[40%] lg:pt-10">
          <div className="space-y-0">
            {popularReads.slice(0, 4).map((post: any, index: number) => {
              const coverData = getCoverImage(
                post.cover as {
                  source?: "asset" | "external";
                  externalUrl?: string | null;
                  image?: any;
                  alt?: string | null;
                } | null,
                post.title || "Untitled"
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
                  {index < 3 && (
                    <div className="border-b border-dotted border-border" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 bg-neutral-100 p-8 rounded-lg">
            <SectionHeader title="More News" variant="light" />
            <div className="space-y-0 divide-y divide-border">
              {posts.slice(4, 8).map((post) => (
                <TagTextNewsItem
                  key={post._id}
                  title={post.title || "Untitled"}
                  slug={post.slug || "#"}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <ShowMoreSection posts={posts as any} tagSlug={slug} />
    </main>
  );
}

import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import ShowMoreSection from "./ShowMoreSection";
import TagViewTracker from "./TagViewTracker";

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
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-wide font-sans">
            {tag.title}
          </h2>

          {/* Featured Article */}
          {posts.length > 0 && (
            <article className="mb-8">
              <Link
                href={`/post/${posts[0].slug || "#"}`}
                className="block group"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  {(() => {
                    const coverData = getCoverImage(
                      posts[0].cover as {
                        source?: "asset" | "external";
                        externalUrl?: string | null;
                        image?: any;
                        alt?: string | null;
                      } | null,
                      posts[0].title || "Featured article"
                    );
                    if (coverData?.src) {
                      return (
                        <Image
                          src={coverData.src}
                          alt={coverData.alt}
                          fill
                          unoptimized={coverData.unoptimized}
                          className="object-cover"
                          priority
                        />
                      );
                    }
                    return (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    );
                  })()}
                </div>
                <div className="mt-4">
                  <h1 className="mt-2 text-xl font-semibold leading-tight md:text-3xl font-sans">
                    {posts[0].title}
                  </h1>
                </div>
              </Link>
            </article>
          )}

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
                <ArticleItem
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
                  <NewsItem
                    image={coverData?.src || "/placeholder.svg"}
                    imageUnoptimized={coverData?.unoptimized}
                    title={post.title || "Untitled"}
                    readTime={`${post.readTime || 5} MIN READ`}
                    slug={post.slug || "#"}
                  />
                  {index < 3 && (
                    <div className="border-b border-dotted border-border" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-0 divide-y divide-border border-t">
            {posts.slice(4, 8).map((post) => (
              <TextNewsItem
                key={post._id}
                title={post.title || "Untitled"}
                slug={post.slug || "#"}
              />
            ))}
          </div>
        </aside>
      </div>

      <ShowMoreSection posts={posts as any} tagSlug={slug} />
    </main>
  );
}

function ArticleItem({
  image,
  imageUnoptimized,
  title,
  slug,
}: {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
}) {
  return (
    <article className="flex gap-6 py-4 first:pt-0">
      <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg">
        <Link href={`/post/${slug}`} className="block h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt=""
            fill
            unoptimized={imageUnoptimized}
            className="object-cover"
            sizes="160px"
          />
        </Link>
      </div>
      <Link href={`/post/${slug}`} className="block flex-1">
        <h2 className="text-pretty text-base font-normal leading-snug md:text-lg font-sans">
          {title}
        </h2>
      </Link>
    </article>
  );
}

function NewsItem({
  image,
  imageUnoptimized,
  title,
  readTime,
  slug,
}: {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  readTime: string;
  slug: string;
}) {
  return (
    <article className="flex gap-4 py-6">
      <div className="flex-1">
        <Link href={`/post/${slug}`} className="block">
          <h2 className="text-base font-sans font-semibold leading-tight">
            {title}
          </h2>
        </Link>
        <p className="mt-2 text-xs font-secondary font-semibold capitalize tracking-wide text-muted-foreground">
          {readTime}
        </p>
      </div>
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
        <Link href={`/post/${slug}`} className="block h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt=""
            fill
            unoptimized={imageUnoptimized}
            className="object-cover"
            sizes="128px"
          />
        </Link>
      </div>
    </article>
  );
}

function TextNewsItem({ title, slug }: { title: string; slug: string }) {
  return (
    <article className="py-5">
      <Link href={`/post/${slug}`} className="block">
        <h3 className="text-base font-sans font-semibold leading-tight">
          {title}
        </h3>
      </Link>
    </article>
  );
}

function FullWidthArticle({
  image,
  title,
  description,
  readTime,
  slug,
}: {
  image: string;
  title: string;
  description: string;
  readTime: string;
  slug: string;
}) {
  return (
    <article className="flex flex-col gap-4 py-8 lg:flex-row lg:gap-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:h-48 lg:w-48 lg:flex-shrink-0">
        <Link href={`/post/${slug}`} className="block h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 192px"
          />
        </Link>
      </div>
      <div className="flex-1">
        <Link href={`/post/${slug}`} className="block">
          <h2 className="text-balance text-xl font-bold leading-tight md:text-2xl font-sans">
            {title}
          </h2>
        </Link>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {readTime}
        </p>
      </div>
    </article>
  );
}

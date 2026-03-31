"use client";

import { useState } from "react";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ChevronDown } from "lucide-react";
import { getCoverImage } from "@/sanity/lib/utils";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  href?: string;
  excerpt?: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  date: string;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  views7d?: number | null;
  readTime?: number | null;
}

interface ShowMoreSectionProps {
  posts: Post[];
  tagSlug: string;
}

export default function ShowMoreSection({
  posts,
  tagSlug,
}: ShowMoreSectionProps) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  const handleShowMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVisibleCount((prev) => Math.min(prev + 10, posts.length));
    setIsLoading(false);
  };

  return (
    <SitePageWidth className="mt-16">
      <SectionHeader
        title="In case you missed it..."
        variant="light"
        accentStyle="geometric-square"
        size="large"
      />
      <div className="space-y-0 divide-y divide-dotted divide-border border-b border-dotted">
        {visiblePosts.map((post) => {
          const coverData = getCoverImage(
            post.cover,
            post.title || "Article image"
          );
          return (
            <FullWidthArticle
              key={post._id}
              image={coverData?.src || "/placeholder.svg"}
              imageUnoptimized={coverData?.unoptimized}
              title={post.title || "Untitled"}
              description={post.excerpt || ""}
              readTime={`${post.readTime || 3} MIN READ`}
              slug={post.slug || "#"}
              href={post.href}
            />
          );
        })}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleShowMore}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2 font-sans"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Show more
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </SitePageWidth>
  );
}

function FullWidthArticle({
  image,
  imageUnoptimized,
  title,
  description,
  readTime,
  slug,
  href,
}: {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  description: string;
  readTime: string;
  slug: string;
  href?: string;
}) {
  const to = href ?? `/post/${slug}`;
  return (
    <article className="flex flex-col gap-4 py-8 lg:flex-row lg:gap-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:h-32 lg:w-32 lg:flex-shrink-0">
        <Link
          href={to}
          className="block h-full"
          aria-label={`Read article: ${title}`}
        >
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt=""
            width={192}
            height={108}
            fill
            unoptimized={imageUnoptimized}
            sizes="(max-width: 1024px) 100vw, 192px"
            className="object-cover"
          />
        </Link>
      </div>
      <div className="flex-1">
        <Link href={to} className="block">
          <h2 className="text-2xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
            {title}
          </h2>
        </Link>
        <p className="text-muted-foreground leading-relaxed text-pretty font-sans text-base mt-2">
          {description}
        </p>
        <p className="mt-3 text-xs font-semibold capitalize tracking-wide text-muted-foreground font-sans">
          {readTime}
        </p>
      </div>
    </article>
  );
}

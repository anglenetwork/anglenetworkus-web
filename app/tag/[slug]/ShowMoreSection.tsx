"use client";

import { useState } from "react";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Circle } from "lucide-react";
import { getCoverImage } from "@/sanity/lib/utils";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import {
  tagIcymiHeading,
  tagLatestRowImageFrame,
  tagShowMoreTitle,
} from "@/app/lib/typography/tag-page";

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
  tagTitle: string;
}

export default function ShowMoreSection({
  posts,
  tagTitle,
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
    <SitePageWidth className="pt-8 pb-[90px]">
      <div className="mb-6 flex items-baseline gap-[18px]">
        <div className="flex items-center gap-[9px]">
          <Circle
            className="size-[13px] shrink-0 text-news-primary"
            strokeWidth={2.5}
            aria-hidden
          />
          <h2 className={tagIcymiHeading}>Latest {tagTitle} news</h2>
        </div>
        <div className="h-px flex-1 bg-news-border" />
      </div>
      <div className="space-y-0 divide-y divide-dotted divide-border border-b border-dotted">
        {visiblePosts.map((post) => {
          const coverData = getCoverImage(
            post.cover,
            post.title || "Article image",
          );
          return (
            <FullWidthArticle
              key={post._id}
              image={coverData?.src || "/placeholder.svg"}
              imageUnoptimized={coverData?.unoptimized}
              title={post.title || "Untitled"}
              description={post.excerpt || ""}
              readTimeMinutes={post.readTime}
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
                <ChevronDown className="size-4" />
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
  readTimeMinutes,
  slug,
  href,
}: {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  description: string;
  readTimeMinutes?: number | null;
  slug: string;
  href?: string;
}) {
  const to = href ?? `/post/${slug}`;
  return (
    <article className="flex items-start gap-4 py-8 sm:gap-6">
      <div className={tagLatestRowImageFrame}>
        <Link
          href={to}
          className="block size-full"
          aria-label={`Read article: ${title}`}
        >
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt=""
            width={96}
            height={96}
            fill
            unoptimized={imageUnoptimized}
            sizes="96px"
            className="object-cover object-center"
          />
        </Link>
      </div>
      <div className="flex-1">
        <Link href={to} className="block">
          <h2 className={tagShowMoreTitle}>{title}</h2>
        </Link>
        <p className="mt-2 text-pretty font-sans text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
        <ReadTimeLabel
          minutes={readTimeMinutes}
          variant="muted"
          className="font-mono"
        />
      </div>
    </article>
  );
}

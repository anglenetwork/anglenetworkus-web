"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
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
    <div className="mx-auto mt-16 max-w-7xl">
      <h2 className="mb-6 text-2xl font-bold font-inter">
        In case you missed it...
      </h2>
      <div className="space-y-0 divide-y divide-dotted divide-border border-t border-dotted">
        {visiblePosts.map((post) => (
          <FullWidthArticle
            key={post._id}
            image={
              post.coverImage
                ? urlForImage(post.coverImage)?.url() || "/placeholder.svg"
                : "/placeholder.svg"
            }
            title={post.title || "Untitled"}
            description={post.excerpt || ""}
            readTime={`${post.readTime || 5} MIN READ`}
            slug={post.slug || "#"}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleShowMore}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2 font-inter"
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
    </div>
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
      <div className="relative aspect-video w-full overflow-hidden rounded-lg lg:h-32 lg:w-32 lg:flex-shrink-0">
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
          <h2 className="text-balance text-xl font-medium leading-tight md:text-2xl font-outfit">
            {title}
          </h2>
        </Link>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base font-inter">
          {description}
        </p>
        <p className="mt-3 text-xs font-semibold capitalize tracking-wide text-muted-foreground font-inter">
          {readTime}
        </p>
      </div>
    </article>
  );
}

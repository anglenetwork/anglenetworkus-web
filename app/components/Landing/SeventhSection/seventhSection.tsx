"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { sectionLeadImageClassName } from "@/app/lib/homepage/section-grid-cells";
import {
  featuredStoriesEyebrow,
  featuredStoriesHeadline,
  featuredStoriesHeading,
} from "@/app/lib/typography/seventh-section";
import { articleFamilyHref } from "@/app/lib/article-family/routes";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "@/app/components/ui/image-renderer";

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: unknown;
    alt?: string | null;
  } | null;
  readTime?: number | null;
}

interface CategoryData {
  slug: string | null;
  name: string | null;
  thirdArticle: Post | null;
}

interface SeventhSectionProps {
  categoriesData?: CategoryData[];
}

const CAROUSEL_CARD_WIDTH = 280;
const CAROUSEL_GAP = 24;

function FeaturedStoryCarouselCard({
  categoryName,
  post,
}: {
  categoryName: string;
  post: Post;
}) {
  const href = articleFamilyHref("post", post.slug!);
  const coverData = getHomepageCoverImage(
    "sectionFeatured",
    post.cover as Parameters<typeof getHomepageCoverImage>[1],
    post.title || "Article image",
  );

  return (
    <Link
      href={href}
      className="group block w-[280px] shrink-0 max-[520px]:w-[240px]"
      aria-label={`Read article: ${post.title}`}
    >
      {coverData?.src ? (
        <div className={sectionLeadImageClassName("3/4")}>
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={525}
            height={700}
            fill
            unoptimized={coverData.unoptimized}
            sizes="280px"
            className="object-cover object-center"
          />
        </div>
      ) : (
        <div
          className={cn(sectionLeadImageClassName("3/4"), "bg-angle-paper")}
          aria-hidden
        />
      )}
      <p className={featuredStoriesEyebrow}>{categoryName}</p>
      <h3 className={featuredStoriesHeadline}>{post.title}</h3>
      <ReadTimeLabel
        minutes={post.readTime}
        variant="angle"
        className="mt-2.5"
      />
    </Link>
  );
}

export default function SeventhSection({
  categoriesData,
}: SeventhSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const rows =
    categoriesData?.flatMap((category) => {
      if (!category.thirdArticle?.slug || !category.thirdArticle.title) {
        return [];
      }
      return [
        {
          id: category.thirdArticle._id,
          categoryName: category.name || "Uncategorized",
          post: category.thirdArticle,
        },
      ];
    }) ?? [];

  if (rows.length === 0) {
    return null;
  }

  const scrollByCards = (direction: -1 | 1) => {
    scrollContainerRef.current?.scrollBy({
      left: direction * (CAROUSEL_CARD_WIDTH + CAROUSEL_GAP),
      behavior: "smooth",
    });
  };

  const scrollButtonClassName =
    "absolute top-[calc(240px*2/3)] z-10 hidden size-9 -translate-y-1/2 items-center justify-center border border-angle-hairline bg-angle-bg text-angle-ink transition-colors hover:bg-angle-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-angle-red md:top-[calc(280px*2/3)] md:flex";

  return (
    <section aria-label="Featured Stories">
      <div className="mb-9 flex items-baseline gap-[18px]">
        <h2 className={featuredStoriesHeading}>Featured Stories</h2>
        <div className="h-px flex-1 bg-angle-hairline" aria-hidden />
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Scroll left"
          className={cn(scrollButtonClassName, "left-0 -translate-x-1/2")}
          onClick={() => scrollByCards(-1)}
        >
          <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
        </button>

        <button
          type="button"
          aria-label="Scroll right"
          className={cn(scrollButtonClassName, "right-0 translate-x-1/2")}
          onClick={() => scrollByCards(1)}
        >
          <ChevronRight className="size-4" strokeWidth={2} aria-hidden />
        </button>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-0 md:px-5"
        >
          {rows.map((row) => (
            <div key={row.id} className="snap-start">
              <FeaturedStoryCarouselCard
                categoryName={row.categoryName}
                post={row.post}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

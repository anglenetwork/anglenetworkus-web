"use client";

import { cn } from "@/lib/utils";
import { FeaturedStoryColumn } from "@/app/components/ui/featured-story-column";
import type { TagsGlimpseProps } from "./types";

const IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw";

const XL_GRID_COLS: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
};

export function TagsGlimpse({ items, variant = "news" }: TagsGlimpseProps) {
  if (items.length === 0) {
    return null;
  }

  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";
  const useTwoColumns = items.length >= 2;

  return (
    <section
      aria-label="Tags glimpse"
      className={cn(
        "rounded-lg",
        variant === "dark" ? "bg-news-secondary" : "bg-news-surface",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-dotted",
          divideClass,
          useTwoColumns &&
            "md:grid-cols-2 md:divide-x md:divide-y-0 md:[&>*:nth-child(n+3)]:border-t md:[&>*:nth-child(n+3)]:border-dotted",
          XL_GRID_COLS[items.length] ?? "xl:grid-cols-4",
          items.length >= 2 &&
            "xl:divide-x xl:divide-y-0 xl:[&>*:nth-child(n+3)]:border-t-0",
        )}
      >
        {items.map((item) => (
          <article
            key={item.tagSlug}
            className="space-y-4 py-6 first:pt-0 last:pb-0 md:px-6 md:py-6 xl:py-0"
          >
            <FeaturedStoryColumn
              headerTitle={item.tagTitle}
              headerHref={`/tag/${item.tagSlug}`}
              headerLayout="title-with-more"
              article={item.article}
              variant={variant}
              imageSizes={IMAGE_SIZES}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

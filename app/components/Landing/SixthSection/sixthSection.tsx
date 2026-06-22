"use client";

import { cn } from "@/lib/utils";
import {
  FeaturedStoryColumn,
  type FeaturedStoryArticle,
} from "@/app/components/ui/featured-story-column";

interface SixthSectionArticle extends FeaturedStoryArticle {
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface SixthSectionProps {
  leftArticle: SixthSectionArticle;
  centerArticle: SixthSectionArticle;
  rightArticle: SixthSectionArticle;
  variant?: "news" | "dark";
}

function sixthSectionColumnProps(article: SixthSectionArticle) {
  return {
    headerTitle: article.category?.title || "More Top Headlines",
    headerHref: article.category?.slug
      ? `/category/${article.category.slug}`
      : undefined,
    article,
  };
}

export default function SixthSection({
  leftArticle,
  centerArticle,
  rightArticle,
  variant = "news",
}: SixthSectionProps) {
  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";

  return (
    <main
      className={cn(
        "rounded-lg",
        variant === "dark" ? "bg-news-secondary" : "bg-news-surface",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-dotted lg:grid-cols-3 lg:divide-x lg:divide-y-0",
          divideClass,
        )}
      >
        {[leftArticle, centerArticle, rightArticle].map((article) => (
          <article
            key={article.slug}
            className="space-y-4 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
          >
            <FeaturedStoryColumn
              {...sixthSectionColumnProps(article)}
              variant={variant}
            />
          </article>
        ))}
      </div>
    </main>
  );
}

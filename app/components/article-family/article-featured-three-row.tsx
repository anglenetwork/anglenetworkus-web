import { cn } from "@/lib/utils";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { OpinionColumnCard } from "./OpinionColumnCard";

export const ARTICLE_FEATURED_THREE_ROW_COUNT = 3;

export function ArticleFeaturedThreeRowGrid({
  articles,
}: {
  articles: CardModel[];
}) {
  const featured = articles.slice(0, ARTICLE_FEATURED_THREE_ROW_COUNT);

  if (featured.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 divide-y divide-dotted divide-neutral-500 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
      {featured.map((article) => (
        <OpinionColumnCard
          key={article._id}
          article={article}
          layout="featured"
        />
      ))}
    </div>
  );
}

export function ArticleFeaturedThreeRow({
  articles,
  className,
  ariaLabel = "Featured articles",
}: {
  articles: CardModel[];
  className?: string;
  ariaLabel?: string;
}) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={ariaLabel}
      className={cn(
        "rounded-lg bg-neutral-100 px-4 py-6 md:px-6 md:py-8",
        className,
      )}
    >
      <ArticleFeaturedThreeRowGrid articles={articles} />
    </section>
  );
}

import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { ArticleFeaturedThreeRowGrid } from "./article-featured-three-row";
import { OpinionColumnCard } from "./OpinionColumnCard";

export function OpinionGridModule({ articles }: { articles: CardModel[] }) {
  const remainingArticles = articles.slice(3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-news-surface px-4 py-6 md:px-6 md:py-8">
      <ArticleFeaturedThreeRowGrid articles={articles} />
      {remainingArticles.length > 0 ? (
        <div className="mt-6 border-news-border border-t border-dotted pt-6">
          <div className="flex flex-col divide-y divide-dotted divide-neutral-500">
            {remainingArticles.map((article) => (
              <OpinionColumnCard
                key={article._id}
                article={article}
                padded={false}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

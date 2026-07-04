import { cn } from "@/lib/utils";
import { FeatureHero } from "./FeatureHero";
import { FeatureSideItem } from "./FeatureSideItem";
import type { Article } from "./types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

interface FeaturedArticlesSectionProps {
  featuredArticles: {
    leftColumn: Article[];
    centerArticle: Article;
    rightColumn: Article[];
  };
}

/** First side article renders as the bigger "feature" item; the rest render as compact "mini" rows. */
function sideItemWrapperClassName(index: number) {
  return cn(
    index > 0 &&
      "mt-[18px] border-news-border border-t border-dotted pt-[18px] sm:mt-[22px] sm:pt-[22px]",
    index === 0 &&
      "max-sm:mt-[18px] max-sm:border-news-border max-sm:border-t max-sm:border-dotted max-sm:pt-[18px]",
  );
}

function FeatureSideList({
  articles,
  variant,
}: {
  articles: Article[];
  variant: "light" | "news" | "dark";
}) {
  if (articles.length === 0) return null;

  return (
    <div className="flex flex-col">
      {articles.map((article, index) => (
        <div key={article.id} className={sideItemWrapperClassName(index)}>
          <FeatureSideItem
            article={article}
            variant={variant}
            layout={index === 0 ? "feature" : "mini"}
          />
        </div>
      ))}
    </div>
  );
}

export function FeaturedArticlesSection({
  featuredArticles,
}: FeaturedArticlesSectionProps) {
  const variant = "news" as const;
  const sideArticles = [
    ...featuredArticles.leftColumn,
    ...featuredArticles.rightColumn,
  ];

  return (
    <section className="bg-news-surface">
      <SitePageWidth>
        <div className="border-news-border border-b xl:hidden">
          <div className="pt-[18px] pb-[20px] sm:border-news-border sm:border-b sm:pt-12 sm:pb-14">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant={variant}
            />
          </div>
          <div className="pt-0 pb-10 sm:pt-12">
            <FeatureSideList articles={sideArticles} variant={variant} />
          </div>
        </div>

        <div className="hidden grid-cols-[1.7fr_1fr] divide-x divide-news-border border-news-border border-b xl:grid">
          <div className="min-w-0 pt-12 pr-12 pb-14">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant={variant}
            />
          </div>

          <div className="min-w-0 pt-12 pb-10 pl-12">
            <FeatureSideList articles={sideArticles} variant={variant} />
          </div>
        </div>
      </SitePageWidth>
    </section>
  );
}

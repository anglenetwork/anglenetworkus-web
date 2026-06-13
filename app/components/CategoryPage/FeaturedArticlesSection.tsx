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

function SideArticleList({
  articles,
  variant,
  className,
}: {
  articles: Article[];
  variant: "light" | "news" | "dark";
  className?: string;
}) {
  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";

  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-dotted",
        divideClass,
        className,
      )}
    >
      {articles.map((article) => (
        <div key={article.id} className="py-4 first:pt-0 last:pb-0">
          <FeatureSideItem article={article} variant={variant} />
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
    <section className="border-news-border border-b bg-news-border">
      <SitePageWidth className="py-12">
        <div className="lg:hidden">
          <FeatureHero
            article={featuredArticles.centerArticle}
            variant={variant}
          />
          {sideArticles.length > 0 ? (
            <div className="mt-8">
              <SideArticleList articles={sideArticles} variant={variant} />
            </div>
          ) : null}
        </div>

        <div className="hidden grid-cols-[1fr_3fr_1fr] divide-x divide-dotted divide-news-border lg:grid">
          <div className="min-w-0 px-6 py-0">
            <SideArticleList
              articles={featuredArticles.leftColumn}
              variant={variant}
            />
          </div>

          <div className="min-w-0 px-6">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant={variant}
              emphasizeTitleOnXl
            />
          </div>

          <div className="min-w-0 px-6 py-0">
            <SideArticleList
              articles={featuredArticles.rightColumn}
              variant={variant}
            />
          </div>
        </div>
      </SitePageWidth>
    </section>
  );
}

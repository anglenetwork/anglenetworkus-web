import { cn } from "@/lib/utils";
import { FeatureHero } from "./FeatureHero";
import { FeatureSideItem } from "./FeatureSideItem";
import type { Article } from "./types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import {
  NewsHeadlineRow,
  type NewsHeadlineRowItem,
} from "@/app/components/ui/news-headline-row";

interface FeaturedArticlesSectionProps {
  featuredArticles: {
    leftColumn: Article[];
    centerArticle: Article;
    rightColumn: Article[];
  };
  headlineRowArticles?: Article[];
}

function articleToHeadlineRowItem(article: Article): NewsHeadlineRowItem {
  return {
    id: article.id,
    title: article.title,
    href: article.href ?? `/post/${article.slug}`,
    readTimeMinutes: article.readTime,
  };
}

function SideArticleList({
  articles,
  variant,
  layout = "stacked",
  className,
}: {
  articles: Article[];
  variant: "light" | "news" | "dark";
  layout?: "stacked" | "compact";
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
          <FeatureSideItem
            article={article}
            variant={variant}
            layout={layout}
          />
        </div>
      ))}
    </div>
  );
}

export function FeaturedArticlesSection({
  featuredArticles,
  headlineRowArticles,
}: FeaturedArticlesSectionProps) {
  const variant = "news" as const;
  const sideArticles = [
    ...featuredArticles.leftColumn,
    ...featuredArticles.rightColumn,
  ];

  return (
    <section className="bg-news-surface">
      <SitePageWidth className="py-6">
        <div className="xl:hidden">
          <FeatureHero
            article={featuredArticles.centerArticle}
            variant={variant}
          />
          {sideArticles.length > 0 ? (
            <div className="mt-8">
              <SideArticleList
                articles={sideArticles}
                variant={variant}
                layout="compact"
              />
            </div>
          ) : null}
        </div>

        <div className="hidden grid-cols-[1fr_3fr_1fr] divide-x divide-dotted divide-news-border xl:grid">
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

      {headlineRowArticles && headlineRowArticles.length > 0 ? (
        <SitePageWidth className="mt-8">
          <NewsHeadlineRow
            items={headlineRowArticles.map(articleToHeadlineRowItem)}
            columns={4}
            variant="news"
            ariaLabel="More category headlines"
          />
        </SitePageWidth>
      ) : null}
    </section>
  );
}

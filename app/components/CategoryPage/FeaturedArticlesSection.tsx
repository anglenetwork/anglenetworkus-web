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
  categoryName: string;
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
  divideStyle = "dotted",
  className,
}: {
  articles: Article[];
  variant: "light" | "news" | "dark";
  layout?: "stacked" | "compact" | "text";
  divideStyle?: "dotted" | "solid";
  className?: string;
}) {
  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";

  return (
    <div
      className={cn(
        "flex flex-col divide-y",
        divideStyle === "dotted" && "divide-dotted",
        divideClass,
        className,
      )}
    >
      {articles.map((article) => (
        <div key={article.id} className="py-5 first:pt-0 last:pb-0">
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

function AlsoInLabel({ categoryName }: { categoryName: string }) {
  return (
    <p className="mb-6 font-sans text-news-muted text-xs uppercase tracking-wide">
      Also in {categoryName}
    </p>
  );
}

export function FeaturedArticlesSection({
  categoryName,
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
            <div className="mt-10">
              <AlsoInLabel categoryName={categoryName} />
              <SideArticleList
                articles={sideArticles}
                variant={variant}
                layout="text"
                divideStyle="solid"
              />
            </div>
          ) : null}
        </div>

        <div className="hidden grid-cols-[1.7fr_1fr] divide-x divide-news-border xl:grid">
          <div className="min-w-0 pr-10">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant={variant}
              emphasizeTitleOnXl
            />
          </div>

          <div className="min-w-0 pl-10">
            <AlsoInLabel categoryName={categoryName} />
            <SideArticleList
              articles={sideArticles}
              variant={variant}
              layout="text"
              divideStyle="solid"
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

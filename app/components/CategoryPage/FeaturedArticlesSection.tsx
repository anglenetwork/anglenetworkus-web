import { cn } from "@/lib/utils";
import { FeatureHero } from "./FeatureHero";
import { FeatureSideItem } from "./FeatureSideItem";
import { SectionHeader } from "@/app/components/ui/section-header";
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
  variant: "light" | "dark";
  className?: string;
}) {
  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-neutral-300";

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
  const variant = "dark" as const;
  const sideArticles = [
    ...featuredArticles.leftColumn,
    ...featuredArticles.rightColumn,
  ];

  return (
    <section className="border-border border-b bg-neutral-950">
      <SitePageWidth className="py-12">
        <SectionHeader
          title="Featured"
          variant={variant}
          accentStyle="modern"
        />

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

        <div className="hidden lg:grid lg:grid-cols-[1fr_3fr_1fr] lg:divide-x lg:divide-dotted lg:divide-white/30">
          <div className="min-w-0 lg:px-6 lg:py-0">
            <SideArticleList
              articles={featuredArticles.leftColumn}
              variant={variant}
            />
          </div>

          <div className="min-w-0 lg:px-6">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant={variant}
            />
          </div>

          <div className="min-w-0 lg:px-6 lg:py-0">
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

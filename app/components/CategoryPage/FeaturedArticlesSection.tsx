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

export function FeaturedArticlesSection({
  featuredArticles,
}: FeaturedArticlesSectionProps) {
  return (
    <section className="border-border border-b bg-neutral-950">
      <SitePageWidth className="py-12">
        <SectionHeader
          title="Featured"
          variant="dark"
          accentStyle="geometric-square"
          size="large"
        />
        {/* Mobile: center hero, then left, then right (stacked) */}
        <div className="block space-y-8 md:hidden">
          <div className="mb-12">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant="dark"
            />
          </div>

          <div className="space-y-6">
            {featuredArticles.leftColumn.map((a) => (
              <FeatureSideItem key={a.id} article={a} variant="dark" />
            ))}
          </div>

          <div className="space-y-6">
            {featuredArticles.rightColumn.map((a) => (
              <FeatureSideItem key={a.id} article={a} variant="dark" />
            ))}
          </div>
        </div>

        {/* Desktop: 20% - 60% - 20% */}
        {/* Reordered DOM: center first for proper heading hierarchy (h2 before h3) */}
        <div className="hidden grid-cols-5 gap-8 md:grid">
          {/* Center column first in DOM for proper h2 -> h3 hierarchy, visually positioned in center */}
          <div className="order-2 col-span-3 col-start-2">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant="dark"
            />
          </div>

          {/* Left column - visually first, but appears after center in DOM */}
          <div className="order-1 col-span-1 space-y-6">
            {featuredArticles.leftColumn.map((a) => (
              <FeatureSideItem key={a.id} article={a} variant="dark" />
            ))}
          </div>

          {/* Right column - visually last */}
          <div className="order-3 col-span-1 space-y-6">
            {featuredArticles.rightColumn.map((a) => (
              <FeatureSideItem key={a.id} article={a} variant="dark" />
            ))}
          </div>
        </div>
      </SitePageWidth>
    </section>
  );
}

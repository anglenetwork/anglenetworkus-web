import { FeatureHero } from "./FeatureHero";
import { FeatureSideItem } from "./FeatureSideItem";
import { SectionHeader } from "@/app/components/ui/section-header";
import type { Article } from "./types";

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
    <section className="border-b border-border bg-black">
      <div className="container mx-auto px-4 md:px-20 py-12">
        <SectionHeader title="Featured" variant="dark" />
        {/* Mobile: center hero, then left, then right (stacked) */}
        <div className="block md:hidden space-y-8">
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
        <div className="hidden md:grid grid-cols-5 gap-8">
          {/* Center column first in DOM for proper h2 -> h3 hierarchy, visually positioned in center */}
          <div className="col-span-3 col-start-2 order-2">
            <FeatureHero
              article={featuredArticles.centerArticle}
              variant="dark"
            />
          </div>

          {/* Left column - visually first, but appears after center in DOM */}
          <div className="col-span-1 order-1 space-y-6">
            {featuredArticles.leftColumn.map((a) => (
              <FeatureSideItem key={a.id} article={a} variant="dark" />
            ))}
          </div>

          {/* Right column - visually last */}
          <div className="col-span-1 order-3 space-y-6">
            {featuredArticles.rightColumn.map((a) => (
              <FeatureSideItem key={a.id} article={a} variant="dark" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { LatestArticlesSection } from "./LatestArticlesSection";
import { CategoryHeader } from "./CategoryHeader";
import { FeaturedArticlesSection } from "./FeaturedArticlesSection";
import { MostReadSection } from "./MostReadSection";
import { CategoryArticlesEmptyState } from "./CategoryArticlesEmptyState";
import type { CategoryPageProps } from "./types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

export function CategoryPage({
  categoryName,
  hasPosts,
  categoryDescription,
  latestArticles,
  mostReadArticles,
  featuredArticles,
  categoryTickerPosts,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        categoryTickerPosts={categoryTickerPosts}
      />

      {featuredArticles && (
        <FeaturedArticlesSection featuredArticles={featuredArticles} />
      )}

      <main>
        <SitePageWidth className="py-12">
          {!hasPosts ? (
            <CategoryArticlesEmptyState categoryName={categoryName} />
          ) : (
            <>
              {/* Mobile: Most Read + Latest */}
              <div className="block space-y-12 lg:hidden">
                <MostReadSection articles={mostReadArticles} />
                <LatestArticlesSection
                  layout="mobile"
                  latestArticles={latestArticles}
                />
              </div>

              {/* Desktop: Latest (main) + Most Read (sidebar) */}
              <div className="hidden grid-cols-3 gap-12 lg:grid">
                <div className="col-span-2">
                  <LatestArticlesSection
                    layout="desktop"
                    latestArticles={latestArticles}
                  />
                </div>

                <aside className="col-span-1">
                  <div className="sticky top-8">
                    <MostReadSection articles={mostReadArticles} />
                  </div>
                </aside>
              </div>
            </>
          )}
        </SitePageWidth>
      </main>
    </div>
  );
}

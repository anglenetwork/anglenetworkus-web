import { LatestArticlesSection } from "./LatestArticlesSection";
import { CategoryHeader } from "./CategoryHeader";
import { FeaturedArticlesSection } from "./FeaturedArticlesSection";
import { MostReadSection } from "./MostReadSection";
import type { CategoryPageProps } from "./types";

export function CategoryPage({
  categoryName,
  categoryDescription,
  latestArticles,
  mostReadArticles,
  featuredArticles,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader
        categoryName={categoryName}
        categoryDescription={categoryDescription}
      />

      {featuredArticles && (
        <FeaturedArticlesSection featuredArticles={featuredArticles} />
      )}

      <main className="container mx-auto px-4 py-12">
        {/* Mobile: Most Read + Latest */}
        <div className="block lg:hidden space-y-12">
          <MostReadSection articles={mostReadArticles} />
          <LatestArticlesSection
            layout="mobile"
            latestArticles={latestArticles}
          />
        </div>

        {/* Desktop: Latest (main) + Most Read (sidebar) */}
        <div className="hidden lg:grid grid-cols-3 gap-12">
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
      </main>
    </div>
  );
}

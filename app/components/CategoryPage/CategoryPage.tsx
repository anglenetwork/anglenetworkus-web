import { LatestArticlesSection } from "./LatestArticlesSection";
import { CategoryHeader } from "./CategoryHeader";
import { FeaturedArticlesSection } from "./FeaturedArticlesSection";
import { MostReadSection } from "./MostReadSection";
import { MoreInCategorySection } from "./MoreInCategorySection";
import { CategoryArticlesEmptyState } from "./CategoryArticlesEmptyState";
import type { CategoryPageProps } from "./types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

export function CategoryPage({
  categoryName,
  hasPosts,
  categoryDescription,
  categoryTags,
  latestArticles,
  mostReadArticles,
  missedItArticles,
  tagsGlimpse,
  featuredArticles,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-news-background">
      <CategoryHeader
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        categoryTags={categoryTags}
      />

      {featuredArticles ? (
        <FeaturedArticlesSection featuredArticles={featuredArticles} />
      ) : null}

      <SitePageWidth className="pt-14 pb-10 max-lg:pb-4">
        <MoreInCategorySection
          categoryName={categoryName}
          missedItArticles={missedItArticles}
          tagsGlimpse={tagsGlimpse}
        />
      </SitePageWidth>

      <main>
        <SitePageWidth className="pt-8 pb-12 max-lg:pt-4">
          {!hasPosts ? (
            <CategoryArticlesEmptyState categoryName={categoryName} />
          ) : (
            <>
              <div className="block space-y-12 lg:hidden">
                <MostReadSection articles={mostReadArticles} />
                <LatestArticlesSection
                  layout="mobile"
                  latestArticles={latestArticles}
                />
              </div>

              <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] xl:grid-cols-3">
                <div className="min-w-0 xl:col-span-2">
                  <LatestArticlesSection
                    layout="desktop"
                    latestArticles={latestArticles}
                  />
                </div>

                <aside className="min-w-0 xl:col-span-1">
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

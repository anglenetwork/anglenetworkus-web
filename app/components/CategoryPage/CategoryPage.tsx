import { LatestArticlesSection } from "./LatestArticlesSection";
import { CategoryHeader } from "./CategoryHeader";
import { FeaturedArticlesSection } from "./FeaturedArticlesSection";
import { MostReadSection } from "./MostReadSection";
import { CategoryArticlesEmptyState } from "./CategoryArticlesEmptyState";
import type { Article, CategoryPageProps } from "./types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { TagsGlimpse } from "@/app/components/tags-glimpse";
import {
  NewsCardRowSection,
  type NewsCardRowItem,
} from "@/app/components/ui/news-card-row-section";

function articleToNewsCardRowItem(article: Article): NewsCardRowItem {
  return {
    id: article.id,
    title: article.title,
    href: article.href ?? `/post/${article.slug}`,
    image: article.imageUrl ?? "",
    imageAlt: article.imageAlt,
    imageUnoptimized: article.imageUnoptimized,
    readTimeMinutes: article.readTime,
  };
}

export function CategoryPage({
  categoryName,
  hasPosts,
  categoryDescription,
  latestArticles,
  mostReadArticles,
  headlineRowArticles,
  missedItArticles,
  tagsGlimpse,
  featuredArticles,
  categoryTickerPosts,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-news-surface">
      <CategoryHeader
        categoryName={categoryName}
        categoryDescription={categoryDescription}
        categoryTickerPosts={categoryTickerPosts}
      />

      {featuredArticles ? (
        <FeaturedArticlesSection
          featuredArticles={featuredArticles}
          headlineRowArticles={headlineRowArticles}
        />
      ) : null}

      {tagsGlimpse && tagsGlimpse.length > 0 ? (
        <SitePageWidth className="pt-12 pb-12 xl:pb-6">
          <TagsGlimpse items={tagsGlimpse} />
        </SitePageWidth>
      ) : null}

      {missedItArticles && missedItArticles.length > 0 ? (
        <SitePageWidth className="py-12">
          <NewsCardRowSection
            title="In case you missed it"
            items={missedItArticles.map(articleToNewsCardRowItem)}
            columns={4}
            minItems={1}
          />
        </SitePageWidth>
      ) : null}

      <main>
        <SitePageWidth className="py-12">
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

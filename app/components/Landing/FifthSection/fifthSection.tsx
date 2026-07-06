import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { fifthSectionGridClassName } from "@/app/lib/homepage/fifth-section-grid";
import { FifthSectionFeaturedColumn } from "./fifth-section-featured-column";
import { FifthSectionListColumn } from "./fifth-section-list-column";

interface FifthSectionCategoryConfig {
  slug: string;
  title: string;
}

interface FifthSectionProps {
  leftColumnPosts: ArticleFamilyCard[];
  rightColumnPosts: ArticleFamilyCard[];
  leftCategory: FifthSectionCategoryConfig;
  rightCategory: FifthSectionCategoryConfig;
  variant?: "news" | "dark";
}

export default function FifthSection({
  leftColumnPosts,
  rightColumnPosts,
  leftCategory,
  rightCategory,
  variant = "news",
}: FifthSectionProps) {
  const leftForColumn = leftColumnPosts.filter(
    (p) => p.category?.slug === leftCategory.slug,
  );
  const rightForColumn = rightColumnPosts.filter(
    (p) => p.category?.slug === rightCategory.slug,
  );

  const mainArticle = leftForColumn[0];

  if (!mainArticle && rightForColumn.length === 0) {
    return null;
  }

  if (variant === "dark") {
    return (
      <main className="rounded-lg bg-news-secondary">
        <div className="grid grid-cols-1 divide-y divide-dotted divide-white/30 lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          <FifthSectionFeaturedColumn
            category={leftCategory}
            mainArticle={mainArticle}
            variant="dark"
          />
          <FifthSectionListColumn
            category={rightCategory}
            articles={rightForColumn}
            variant="dark"
          />
        </div>
      </main>
    );
  }

  return (
    <section aria-label="World and Politics">
      <div className={fifthSectionGridClassName()}>
        <FifthSectionFeaturedColumn
          category={leftCategory}
          mainArticle={mainArticle}
          variant="news"
        />
        <FifthSectionListColumn
          category={rightCategory}
          articles={rightForColumn}
          variant="news"
        />
      </div>
    </section>
  );
}

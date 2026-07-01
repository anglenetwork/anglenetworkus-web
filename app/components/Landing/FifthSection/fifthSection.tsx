import { cn } from "@/lib/utils";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
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

  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";

  return (
    <main
      className={cn(
        "rounded-lg",
        variant === "dark" ? "bg-news-secondary" : "bg-news-surface",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-dotted lg:grid-cols-12 lg:divide-x lg:divide-y-0",
          divideClass,
        )}
      >
        <FifthSectionFeaturedColumn
          category={leftCategory}
          mainArticle={mainArticle}
          variant={variant}
        />
        <FifthSectionListColumn
          category={rightCategory}
          articles={rightForColumn}
          variant={variant}
          divideClass={divideClass}
        />
      </div>
    </main>
  );
}

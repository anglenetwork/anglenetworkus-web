import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { SectionHeader } from "../../ui/section-header";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "../../ui/image-renderer";
import { getCoverImage } from "@/sanity/lib/utils";

function getImageData(
  cover: ArticleFamilyCard["cover"],
  fallbackTitle: string,
) {
  return getCoverImage(
    cover as Parameters<typeof getCoverImage>[0],
    fallbackTitle,
  );
}

function SmallArticleRow({
  article,
  variant,
}: {
  article: ArticleFamilyCard;
  variant: "news" | "dark";
}) {
  if (!article.slug || !article.href) return null;

  const coverData = getImageData(
    article.cover,
    article.title || "Article image",
  );

  return (
    <Link
      href={article.href}
      className="group flex items-start gap-3"
      aria-label={`Read article: ${article.title}`}
      data-article-category-slug={article.category?.slug ?? ""}
    >
      <div className="min-w-0 flex-1">
        <h3 className={categorySecondaryRowTitle[variant]}>
          {article.title || "Untitled"}
        </h3>
        <ReadTimeLabel minutes={article.readTime} variant={variant} />
      </div>
      {coverData?.src ? (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={112}
            height={80}
            fill
            unoptimized={coverData.unoptimized}
            sizes="112px"
            className="object-cover object-center"
          />
        </div>
      ) : null}
    </Link>
  );
}

interface FifthSectionListColumnProps {
  category: { slug: string; title: string };
  articles: ArticleFamilyCard[];
  variant: "news" | "dark";
  divideClass: string;
}

export function FifthSectionListColumn({
  category,
  articles,
  variant,
  divideClass,
}: FifthSectionListColumnProps) {
  return (
    <article
      className="space-y-4 py-6 last:pb-0 lg:col-span-5 lg:px-6 lg:py-0 xl:col-span-4"
      data-fifth-column="right"
      data-expected-category-slug={category.slug}
    >
      <SectionHeader
        title={category.title}
        href={`/category/${category.slug}`}
        variant={variant}
        accentStyle="minimal"
      />

      <div className={cn("flex flex-col divide-y divide-dotted", divideClass)}>
        {articles.map((article, index) =>
          article?.slug && article.href ? (
            <div
              key={article._id ?? index}
              className="py-4 first:pt-0 last:pb-0"
            >
              <SmallArticleRow article={article} variant={variant} />
            </div>
          ) : null,
        )}
      </div>
    </article>
  );
}

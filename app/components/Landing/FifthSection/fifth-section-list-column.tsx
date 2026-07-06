import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { fifthListColumnClassName } from "@/app/lib/homepage/fifth-section-grid";
import {
  fifthCategoryLabel,
  fifthListHeadline,
} from "@/app/lib/typography/fifth-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "../../ui/image-renderer";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";

function getImageData(
  cover: ArticleFamilyCard["cover"],
  fallbackTitle: string,
) {
  return getHomepageCoverImage(
    "sectionThumb",
    cover as Parameters<typeof getHomepageCoverImage>[1],
    fallbackTitle,
  );
}

function SmallArticleRow({
  article,
  variant,
  isFirst,
}: {
  article: ArticleFamilyCard;
  variant: "news" | "dark";
  isFirst: boolean;
}) {
  if (!article.slug || !article.href) return null;

  const coverData = getImageData(
    article.cover,
    article.title || "Article image",
  );

  if (variant === "dark") {
    return (
      <Link
        href={article.href}
        className="group flex items-start gap-3"
        aria-label={`Read article: ${article.title}`}
        data-article-category-slug={article.category?.slug ?? ""}
      >
        <div className="min-w-0 flex-1">
          <h3 className={categorySecondaryRowTitle.dark}>
            {article.title || "Untitled"}
          </h3>
          <ReadTimeLabel minutes={article.readTime} variant="dark" />
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

  return (
    <Link
      href={article.href}
      className={cn(
        "group flex items-start justify-between gap-4",
        !isFirst &&
          "divider-dashed pt-[22px] max-[520px]:border-angle-hairline max-[520px]:border-t max-[520px]:bg-none",
        !isFirst && "mt-[26px]",
      )}
      aria-label={`Read article: ${article.title}`}
      data-article-category-slug={article.category?.slug ?? ""}
    >
      <div className="min-w-0 flex-1">
        <h3 className={fifthListHeadline}>{article.title || "Untitled"}</h3>
        <ReadTimeLabel
          minutes={article.readTime}
          variant="angle"
          className="mt-2.5"
        />
      </div>
      {coverData?.src ? (
        <div className="relative aspect-square size-16 shrink-0 overflow-hidden bg-angle-paper max-[520px]:size-[72px]">
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={64}
            height={64}
            fill
            unoptimized={coverData.unoptimized}
            sizes="(max-width: 520px) 72px, 64px"
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
  divideClass?: string;
}

export function FifthSectionListColumn({
  category,
  articles,
  variant,
}: FifthSectionListColumnProps) {
  const validArticles = articles.filter((a) => a?.slug && a.href);

  if (variant === "dark") {
    return (
      <article
        className="space-y-4 py-6 last:pb-0 lg:col-span-5 lg:px-6 lg:py-0 xl:col-span-4"
        data-fifth-column="right"
        data-expected-category-slug={category.slug}
      >
        <div className="flex flex-col divide-y divide-dotted divide-white/30">
          {validArticles.map((article, index) => (
            <div
              key={article._id ?? index}
              className="py-4 first:pt-0 last:pb-0"
            >
              <SmallArticleRow
                article={article}
                variant="dark"
                isFirst={index === 0}
              />
            </div>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article
      className={fifthListColumnClassName()}
      data-fifth-column="right"
      data-expected-category-slug={category.slug}
    >
      <Link href={`/category/${category.slug}`} className={fifthCategoryLabel}>
        {category.title}
      </Link>

      <div>
        {validArticles.map((article, index) => (
          <SmallArticleRow
            key={article._id ?? index}
            article={article}
            variant="news"
            isFirst={index === 0}
          />
        ))}
      </div>
    </article>
  );
}

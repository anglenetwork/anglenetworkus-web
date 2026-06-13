import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { ListingPhotoCredit } from "@/app/helpers";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import { fifthSectionFeaturedOverlayTitle } from "@/app/lib/typography/fifth-section";
import {
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

export interface FifthSectionCategoryConfig {
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

const featuredImageOverlayClassName =
  "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-12 pb-4 md:px-6 md:pt-16 md:pb-6";

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
        <article
          className="space-y-4 py-6 first:pt-0 last:pb-0 lg:col-span-7 lg:px-6 lg:py-0 xl:col-span-8"
          data-fifth-column="left"
          data-expected-category-slug={leftCategory.slug}
        >
          <SectionHeader
            title={leftCategory.title}
            href={`/category/${leftCategory.slug}`}
            variant={variant}
            accentStyle="modern"
          />

          {mainArticle?.slug && mainArticle.href && (() => {
            const coverData = getImageData(
              mainArticle.cover,
              mainArticle.title || "Featured article",
            );

            return (
              <div>
                {coverData?.src ? (
                  <Link
                    href={mainArticle.href}
                    className="group block"
                    aria-label={`Read article: ${mainArticle.title || "Featured article"}`}
                    data-article-category-slug={mainArticle.category?.slug ?? ""}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary xl:aspect-[3/2]">
                      <ImageRenderer
                        src={coverData.src}
                        alt={coverData.alt}
                        width={800}
                        height={450}
                        fill
                        unoptimized={coverData.unoptimized}
                        sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 58vw, 66vw"
                        className="absolute inset-0 z-0 object-cover object-center"
                      />
                      <div className={featuredImageOverlayClassName}>
                        <h3 className={fifthSectionFeaturedOverlayTitle}>
                          {mainArticle.title || "Untitled"}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ) : null}
                <ListingPhotoCredit cover={mainArticle.cover} align="right" />
                {!coverData?.src ? (
                  <Link href={mainArticle.href} className="group block">
                    <h3 className={cn("mt-4", categoryFeaturedTitle[variant])}>
                      {mainArticle.title || "Untitled"}
                    </h3>
                  </Link>
                ) : null}
                <ReadTimeLabel
                  minutes={mainArticle.readTime}
                  variant={variant}
                />
              </div>
            );
          })()}
        </article>

        <article
          className="space-y-4 py-6 last:pb-0 lg:col-span-5 lg:px-6 lg:py-0 xl:col-span-4"
          data-fifth-column="right"
          data-expected-category-slug={rightCategory.slug}
        >
          <SectionHeader
            title={rightCategory.title}
            href={`/category/${rightCategory.slug}`}
            variant={variant}
            accentStyle="modern"
          />

          <div
            className={cn("flex flex-col divide-y divide-dotted", divideClass)}
          >
            {rightForColumn.map((article, index) =>
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
      </div>
    </main>
  );
}

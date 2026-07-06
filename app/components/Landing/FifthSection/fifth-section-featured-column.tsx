import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { formatImageCredit } from "@/sanity/lib/utils";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { fifthFeaturedColumnClassName } from "@/app/lib/homepage/fifth-section-grid";
import {
  fifthCategoryLabel,
  fifthFeaturedCredit,
  fifthFeaturedHeadline,
  fifthFeaturedOverlayMeta,
  fifthFeaturedOverlayTitle,
} from "@/app/lib/typography/fifth-section";
import { formatReadTimeLabel } from "@/app/lib/typography/read-time";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "../../ui/image-renderer";

const featuredImageOverlayClassName =
  "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-angle-ink/[0.88] to-transparent px-4 pt-14 pb-4 lg:px-6 lg:pt-16 lg:pb-5";

function getImageData(
  cover: ArticleFamilyCard["cover"],
  fallbackTitle: string,
) {
  return getHomepageCoverImage(
    "fifthFeatured",
    cover as Parameters<typeof getHomepageCoverImage>[1],
    fallbackTitle,
  );
}

interface FifthSectionFeaturedColumnProps {
  category: { slug: string; title: string };
  mainArticle?: ArticleFamilyCard;
  variant: "news" | "dark";
}

export function FifthSectionFeaturedColumn({
  category,
  mainArticle,
  variant,
}: FifthSectionFeaturedColumnProps) {
  if (variant === "dark") {
    return (
      <article
        className="space-y-4 py-6 first:pt-0 last:pb-0 lg:col-span-7 lg:px-6 lg:py-0 xl:col-span-8"
        data-fifth-column="left"
        data-expected-category-slug={category.slug}
      >
        {mainArticle?.slug && mainArticle.href ? (
          <FifthSectionFeaturedArticle article={mainArticle} variant="dark" />
        ) : null}
      </article>
    );
  }

  return (
    <article
      className={fifthFeaturedColumnClassName()}
      data-fifth-column="left"
      data-expected-category-slug={category.slug}
    >
      <Link href={`/category/${category.slug}`} className={fifthCategoryLabel}>
        {category.title}
      </Link>

      {mainArticle?.slug && mainArticle.href ? (
        <FifthSectionFeaturedArticle article={mainArticle} variant="news" />
      ) : null}
    </article>
  );
}

function FifthSectionFeaturedArticle({
  article,
  variant,
}: {
  article: ArticleFamilyCard;
  variant: "news" | "dark";
}) {
  const coverData = getImageData(
    article.cover,
    article.title || "Featured article",
  );
  const credit = formatImageCredit(article.cover);

  if (variant === "dark") {
    return (
      <div>
        {coverData?.src ? (
          <Link
            href={article.href!}
            className="group block"
            aria-label={`Read article: ${article.title || "Featured article"}`}
            data-article-category-slug={article.category?.slug ?? ""}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary xl:aspect-[3/2]">
              <ImageRenderer
                src={coverData.src}
                alt={coverData.alt}
                width={800}
                height={450}
                fill
                unoptimized={coverData.unoptimized}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="absolute inset-0 z-0 object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-12 pb-4 md:px-6 md:pt-16 md:pb-6">
                <h3 className="font-display font-semibold text-white text-xl md:text-2xl">
                  {article.title || "Untitled"}
                </h3>
                <ReadTimeLabel
                  minutes={article.readTime}
                  variant="hero"
                  as="span"
                />
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      {coverData?.src ? (
        <>
          <Link
            href={article.href!}
            className="group block"
            aria-label={`Read article: ${article.title || "Featured article"}`}
            data-article-category-slug={article.category?.slug ?? ""}
          >
            <figure className="relative">
              <div className="relative aspect-[16/12.4] w-full overflow-hidden bg-angle-paper">
                <ImageRenderer
                  src={coverData.src}
                  alt={coverData.alt}
                  width={800}
                  height={620}
                  fill
                  unoptimized={coverData.unoptimized}
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 100vw, 65vw"
                  className="object-cover object-center"
                />
                <figcaption className={featuredImageOverlayClassName}>
                  <h3 className={fifthFeaturedOverlayTitle}>
                    {article.title || "Untitled"}
                  </h3>
                  <p className={fifthFeaturedOverlayMeta}>
                    {formatReadTimeLabel(article.readTime)}
                  </p>
                </figcaption>
              </div>
            </figure>
          </Link>
          {credit ? <p className={fifthFeaturedCredit}>{credit}</p> : null}
        </>
      ) : (
        <>
          <Link
            href={article.href!}
            className="group block"
            data-article-category-slug={article.category?.slug ?? ""}
          >
            <h3 className={fifthFeaturedHeadline}>
              {article.title || "Untitled"}
            </h3>
          </Link>
          <ReadTimeLabel minutes={article.readTime} variant="angle" />
        </>
      )}
    </div>
  );
}

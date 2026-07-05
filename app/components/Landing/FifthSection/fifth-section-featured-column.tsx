import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { ListingPhotoCredit } from "@/app/helpers";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import { fifthSectionFeaturedOverlayTitle } from "@/app/lib/typography/fifth-section";
import { categoryFeaturedTitle } from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

const featuredImageOverlayClassName =
  "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-12 pb-4 md:px-6 md:pt-16 md:pb-6";

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
  return (
    <article
      className="space-y-4 py-6 first:pt-0 last:pb-0 lg:col-span-7 lg:px-6 lg:py-0 xl:col-span-8"
      data-fifth-column="left"
      data-expected-category-slug={category.slug}
    >
      <SectionHeader
        title={category.title}
        href={`/category/${category.slug}`}
        variant={variant}
        accentStyle="minimal"
      />

      {mainArticle?.slug && mainArticle.href ? (
        <FifthSectionFeaturedArticle article={mainArticle} variant={variant} />
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
              sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 58vw, 66vw"
              className="absolute inset-0 z-0 object-cover object-center"
            />
            <div className={featuredImageOverlayClassName}>
              <h3 className={fifthSectionFeaturedOverlayTitle}>
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
      <ListingPhotoCredit cover={article.cover} align="right" />
      {!coverData?.src ? (
        <>
          <Link href={article.href!} className="group block">
            <h3
              className={cn(
                "mt-4",
                categoryFeaturedTitle[variant],
                "xl:text-3xl",
              )}
            >
              {article.title || "Untitled"}
            </h3>
          </Link>
          <ReadTimeLabel minutes={article.readTime} variant={variant} />
        </>
      ) : null}
    </div>
  );
}

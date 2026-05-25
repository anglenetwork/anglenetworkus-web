import Link from "next/link";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { getCoverImage, urlForImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  leftColumnFeaturedTitle,
  leftColumnSecondaryTitle,
  rightColumnFeaturedTitle,
  rightColumnHeadlineLinkTitle,
} from "@/app/lib/typography/fourth-section";

interface GalleryImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: unknown;
  alt?: string | null;
}

function buildGalleryImageData(galleryImage: GalleryImage): {
  src: string;
  alt: string;
  unoptimized: boolean;
} | null {
  if (!galleryImage) return null;

  const hasExternalUrl =
    galleryImage.externalUrl && galleryImage.externalUrl.trim() !== "";
  const hasImageAsset =
    galleryImage.image &&
    (galleryImage.image as { asset?: { _ref?: string } })?.asset?._ref;

  if (!hasExternalUrl && !hasImageAsset) return null;

  if (
    hasExternalUrl &&
    (galleryImage.source === "external" || !galleryImage.source)
  ) {
    let externalUrl = galleryImage.externalUrl!.trim();
    if (externalUrl.startsWith("//")) {
      externalUrl = `https:${externalUrl}`;
    } else if (!externalUrl.match(/^https?:\/\//)) {
      externalUrl = `https://${externalUrl}`;
    }

    try {
      new URL(externalUrl);
      const isWikimedia = /(^|\.)upload\.wikimedia\.org$/.test(
        new URL(externalUrl).hostname,
      );
      return {
        src: externalUrl,
        alt: galleryImage.alt || "Gallery image",
        unoptimized: isWikimedia,
      };
    } catch {
      return null;
    }
  }

  if (
    hasImageAsset &&
    (galleryImage.source === "asset" || !galleryImage.source || !hasExternalUrl)
  ) {
    const imageUrl = urlForImage(
      galleryImage.image as Parameters<typeof urlForImage>[0],
    );
    if (imageUrl) {
      try {
        const url = imageUrl.quality(60).url();
        if (url && url.length > 0) {
          return {
            src: url,
            alt:
              galleryImage.alt ||
              String((galleryImage.image as { alt?: string })?.alt || "") ||
              "Gallery image",
            unoptimized: false,
          };
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

function thumbImageForCard(article: ArticleFamilyCard): {
  src: string;
  alt: string;
  unoptimized: boolean;
} | null {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article",
    480,
  );
  const gal = article.imageGallery;
  const firstGallery =
    Array.isArray(gal) && gal[0] != null
      ? buildGalleryImageData(gal[0] as GalleryImage)
      : null;
  return coverData ?? firstGallery;
}

export interface FifthSectionCategoryConfig {
  slug: string;
  title: string;
}

interface FifthSectionProps {
  leftColumnPosts: ArticleFamilyCard[];
  rightColumnPosts: ArticleFamilyCard[];
  leftCategory: FifthSectionCategoryConfig;
  rightCategory: FifthSectionCategoryConfig;
}

function getImageData(
  cover: ArticleFamilyCard["cover"],
  fallbackTitle: string,
) {
  return getCoverImage(
    cover as Parameters<typeof getCoverImage>[0],
    fallbackTitle,
  );
}

export default function FifthSection({
  leftColumnPosts,
  rightColumnPosts,
  leftCategory,
  rightCategory,
}: FifthSectionProps) {
  const leftForColumn = leftColumnPosts.filter(
    (p) => p.category?.slug === leftCategory.slug,
  );
  const rightForColumn = rightColumnPosts.filter(
    (p) => p.category?.slug === rightCategory.slug,
  );

  const mainArticle = leftForColumn[0];
  const secondaryArticles = leftForColumn.slice(1, 3);

  // Two featured-image cards on top (indices 0 and 3), then four headline links in one column (1–2, 4–5).
  const rightFeaturedSlots = [rightForColumn[0], rightForColumn[3]];
  const rightHeadlineLinks = [
    ...rightForColumn.slice(1, 3),
    ...rightForColumn.slice(4, 6),
  ].filter((a) => a.slug && a.href);

  if (!mainArticle && rightForColumn.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12">
        <div
          className="flex w-full flex-col gap-3 lg:col-span-7"
          data-fifth-column="left"
          data-expected-category-slug={leftCategory.slug}
        >
          <SectionHeader
            title={leftCategory.title}
            variant="light"
            accentStyle="geometric-square"
            size="large"
            href={`/category/${leftCategory.slug}`}
          />
          {mainArticle?.slug && mainArticle.href && (
            <Link
              href={mainArticle.href}
              className="group mb-4 block"
              data-article-category-slug={mainArticle.category?.slug ?? ""}
            >
              <div className="mb-4">
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                  {(() => {
                    const coverData = getImageData(
                      mainArticle.cover,
                      mainArticle.title || "Featured article",
                    );
                    if (!coverData) return null;
                    return (
                      <ImageRenderer
                        src={coverData.src}
                        alt={coverData.alt}
                        width={1200}
                        height={675}
                        fill
                        unoptimized={coverData.unoptimized}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 600px"
                        className="rounded-sm object-cover"
                      />
                    );
                  })()}
                </div>
              </div>
              <h3 className={leftColumnFeaturedTitle}>
                {mainArticle.title || "Untitled"}
              </h3>
            </Link>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {secondaryArticles.map(
              (article) =>
                article.slug &&
                article.href && (
                  <Link
                    key={article._id}
                    href={article.href}
                    className="group block"
                    data-article-category-slug={article.category?.slug ?? ""}
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[4/3]">
                        {(() => {
                          const coverData = getImageData(
                            article.cover,
                            article.title || "Article image",
                          );
                          if (!coverData) return null;
                          return (
                            <ImageRenderer
                              src={coverData.src}
                              alt={coverData.alt}
                              width={700}
                              height={525}
                              fill
                              unoptimized={coverData.unoptimized}
                              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 350px"
                              className="rounded-sm object-cover"
                            />
                          );
                        })()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className={leftColumnSecondaryTitle}>
                        {article.title || "Untitled"}
                      </h3>
                    </div>
                  </Link>
                ),
            )}
          </div>

          <hr className="my-4 border-gray-300 border-t lg:hidden" />
        </div>

        <div
          className="flex w-full flex-col gap-3 lg:col-span-5"
          data-fifth-column="right"
          data-expected-category-slug={rightCategory.slug}
        >
          <SectionHeader
            title={rightCategory.title}
            variant="light"
            accentStyle="geometric-square"
            size="large"
            href={`/category/${rightCategory.slug}`}
          />
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rightFeaturedSlots.map((article, slotIdx) =>
                article?.slug && article.href ? (
                  <Link
                    key={article._id ?? slotIdx}
                    href={article.href}
                    className="group block"
                    data-article-category-slug={article.category?.slug ?? ""}
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-sm lg:aspect-[3/4]">
                        {(() => {
                          const coverData = getImageData(
                            article.cover,
                            article.title || "Article image",
                          );
                          if (!coverData) return null;
                          return (
                            <ImageRenderer
                              src={coverData.src}
                              alt={coverData.alt}
                              width={500}
                              height={667}
                              fill
                              unoptimized={coverData.unoptimized}
                              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 42vw, 280px"
                              className="rounded-sm object-cover"
                            />
                          );
                        })()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className={rightColumnFeaturedTitle}>
                        {article.title || "Untitled"}
                      </h3>
                    </div>
                  </Link>
                ) : null,
              )}
            </div>

            {rightHeadlineLinks.length > 0 && (
              <>
                <hr className="border-gray-300 border-t" />
                <div className="flex flex-col">
                  {rightHeadlineLinks.map((article) => {
                    const thumb = thumbImageForCard(article);
                    return (
                      <div
                        key={article._id}
                        className="border-gray-200 border-b pb-4 last:border-b-0 last:pb-0"
                      >
                        <Link
                          href={article.href}
                          className="group flex items-start gap-4 text-neutral-900"
                          data-article-category-slug={
                            article.category?.slug ?? ""
                          }
                        >
                          <div className="relative h-[100px] w-[160px] shrink-0 overflow-hidden rounded-md xl:h-[150px] xl:w-[240px]">
                            {thumb?.src ? (
                              <ImageRenderer
                                src={thumb.src}
                                alt={thumb.alt}
                                width={320}
                                height={200}
                                fill
                                unoptimized={thumb.unoptimized}
                                sizes="(min-width: 1280px) 240px, 160px"
                                className="object-cover transition-opacity group-hover:opacity-90"
                              />
                            ) : null}
                          </div>
                          <span className={rightColumnHeadlineLinkTitle}>
                            {article.title || "Untitled"}
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

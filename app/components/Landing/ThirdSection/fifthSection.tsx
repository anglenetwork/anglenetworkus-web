import Link from "next/link";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

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

function getImageData(cover: ArticleFamilyCard["cover"], fallbackTitle: string) {
  return getCoverImage(cover as Parameters<typeof getCoverImage>[0], fallbackTitle);
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

  if (process.env.NODE_ENV === "development") {
    if (leftForColumn.length !== leftColumnPosts.length) {
      console.warn(
        "[FifthSection] Left column: dropped items whose category.slug !==",
        leftCategory.slug,
        {
          incoming: leftColumnPosts.map((p) => ({
            slug: p.slug,
            categorySlug: p.category?.slug,
          })),
        },
      );
    }
    if (rightForColumn.length !== rightColumnPosts.length) {
      console.warn(
        "[FifthSection] Right column: dropped items whose category.slug !==",
        rightCategory.slug,
        {
          incoming: rightColumnPosts.map((p) => ({
            slug: p.slug,
            categorySlug: p.category?.slug,
          })),
        },
      );
    }
  }

  const mainArticle = leftForColumn[0];
  const secondaryArticles = leftForColumn.slice(1, 3);

  const rightFeaturedLeft = rightForColumn[0];
  const rightTextLeft = rightForColumn.slice(1, 5);
  const rightFeaturedRight = rightForColumn[5];
  const rightTextRight = rightForColumn.slice(6, 11);

  if (!mainArticle && rightForColumn.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="px-4 md:px-0">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          <div className="w-full lg:col-span-7 flex flex-col gap-3">
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
                className="group block mb-4"
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
                          className="object-cover rounded-sm"
                        />
                      );
                    })()}
                  </div>
                </div>
                <h3 className="text-2xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
                  {mainArticle.title || "Untitled"}
                </h3>
              </Link>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {secondaryArticles.map(
                (article) =>
                  article.slug &&
                  article.href && (
                    <Link
                      key={article._id}
                      href={article.href}
                      className="group block"
                    >
                      <div>
                        <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-sm">
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
                                className="object-cover rounded-sm"
                              />
                            );
                          })()}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
                          {article.title || "Untitled"}
                        </h3>
                      </div>
                    </Link>
                  ),
              )}
            </div>

            <hr className="border-t border-gray-300 my-4 lg:hidden" />
          </div>

          <div className="w-full lg:col-span-5 flex flex-col gap-3">
            <SectionHeader
              title={rightCategory.title}
              variant="light"
              accentStyle="geometric-square"
              size="large"
              href={`/category/${rightCategory.slug}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              <div className="flex flex-col gap-0">
                {rightFeaturedLeft?.slug && rightFeaturedLeft.href && (
                  <>
                    <Link
                      href={rightFeaturedLeft.href}
                      className="group block"
                    >
                      <div>
                        <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden rounded-sm">
                          {(() => {
                            const coverData = getImageData(
                              rightFeaturedLeft.cover,
                              rightFeaturedLeft.title || "Article image",
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
                                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 42vw, 200px"
                                className="object-cover rounded-sm"
                              />
                            );
                          })()}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
                          {rightFeaturedLeft.title || "Untitled"}
                        </h3>
                      </div>
                    </Link>
                    <hr className="border-t border-gray-300 my-3" />
                  </>
                )}

                <div className="flex flex-col gap-4">
                  {rightTextLeft.map(
                    (article, index) =>
                      article.slug &&
                      article.href && (
                        <div key={article._id}>
                          <Link
                            href={article.href}
                            className="text-base font-sans font-normal text-neutral-900 leading-snug tracking-normal"
                          >
                            {article.title || "Untitled"}
                          </Link>
                          {index < rightTextLeft.length - 1 && (
                            <hr className="border-t border-gray-300 mt-4" />
                          )}
                        </div>
                      ),
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-0">
                {rightFeaturedRight?.slug && rightFeaturedRight.href && (
                  <>
                    <Link
                      href={rightFeaturedRight.href}
                      className="group block"
                    >
                      <div>
                        <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden rounded-sm">
                          {(() => {
                            const coverData = getImageData(
                              rightFeaturedRight.cover,
                              rightFeaturedRight.title || "Article image",
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
                                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 42vw, 200px"
                                className="object-cover rounded-sm"
                              />
                            );
                          })()}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
                          {rightFeaturedRight.title || "Untitled"}
                        </h3>
                      </div>
                    </Link>
                    <hr className="border-t border-gray-300 my-3" />
                  </>
                )}

                <div className="flex flex-col gap-4">
                  {rightTextRight.map(
                    (article, index) =>
                      article.slug &&
                      article.href && (
                        <div key={article._id}>
                          <Link
                            href={article.href}
                            className="text-base font-sans font-normal text-neutral-900 leading-snug tracking-normal"
                          >
                            {article.title || "Untitled"}
                          </Link>
                          {index < rightTextRight.length - 1 && (
                            <hr className="border-t border-gray-300 mt-4" />
                          )}
                        </div>
                      ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

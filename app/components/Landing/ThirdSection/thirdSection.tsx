import Link from "next/link";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  leftColumnFeaturedTitle,
  rightColumnFeaturedTitle,
} from "@/app/lib/typography/third-section";

export interface ThirdSectionCategoryConfig {
  slug: string;
  title: string;
}

interface ThirdSectionProps {
  leftColumnPosts: ArticleFamilyCard[];
  rightColumnPosts: ArticleFamilyCard[];
  leftCategory: ThirdSectionCategoryConfig;
  rightCategory: ThirdSectionCategoryConfig;
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

export default function ThirdSection({
  leftColumnPosts,
  rightColumnPosts,
  leftCategory,
  rightCategory,
}: ThirdSectionProps) {
  const leftForColumn = leftColumnPosts.filter(
    (p) => p.category?.slug === leftCategory.slug,
  );
  const rightForColumn = rightColumnPosts.filter(
    (p) => p.category?.slug === rightCategory.slug,
  );

  const mainArticle = leftForColumn[0];

  // Two featured-image cards on top (indices 0 and 3).
  const rightFeaturedSlots = [rightForColumn[0], rightForColumn[3]];

  if (!mainArticle && rightForColumn.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12">
        <div
          className="flex w-full flex-col gap-3 lg:col-span-7"
          data-third-column="left"
          data-expected-category-slug={leftCategory.slug}
        >
          <SectionHeader
            title={leftCategory.title}
            variant="light"
            accentStyle="small-dot"
            size="regular"
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

          <hr className="my-4 border-gray-300 border-t lg:hidden" />
        </div>

        <div
          className="flex w-full flex-col gap-3 lg:col-span-5"
          data-third-column="right"
          data-expected-category-slug={rightCategory.slug}
        >
          <SectionHeader
            title={rightCategory.title}
            variant="light"
            accentStyle="small-dot"
            size="regular"
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
          </div>
        </div>
      </div>
    </div>
  );
}

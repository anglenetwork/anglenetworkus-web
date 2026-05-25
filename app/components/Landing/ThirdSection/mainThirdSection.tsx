import Link from "next/link";
import { FourthSectionQueryResult } from "@/sanity.types";
import { getCoverImage, formatImageCredit } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

interface FifthSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
}

export default function FifthSection({
  posts,
  categoryTitle,
}: FifthSectionProps) {
  // Helper function to get image data from cover
  const getImageData = (cover: any, fallbackTitle: string = "Article") => {
    const coverData = getCoverImage(cover, fallbackTitle);
    return coverData;
  };

  // Get main article (first post)
  const mainArticle = posts[0];
  // Get secondary articles (next 2 posts) - total 3 articles for left column
  const secondaryArticles = posts.slice(1, 3);
  // Get all remaining articles for right column
  const rightColumnArticles = posts.slice(3, 14);

  return (
    <div className="min-h-screen">
      {/* Main container with consistent padding */}
      <div className="px-4 md:px-0">
        <div className="grid grid-cols-12 gap-0">
          {/* Section Header */}
          <div className="col-span-12">
            <SectionHeader
              title={categoryTitle}
              variant="light"
              accentStyle="geometric-square"
              size="large"
              href={`/category/${categoryTitle.toLowerCase().replace(/\s+/g, "-")}`}
            />
          </div>

          <div className="col-span-12 flex flex-col gap-8 lg:grid lg:grid-cols-12">
            {/* Left Column - Full width on mobile, 7 columns on desktop */}
            <div className="flex w-full flex-col gap-3 lg:col-span-7">
              {mainArticle && (
                <Link
                  href={`/post/${mainArticle.slug || "#"}`}
                  className="group mb-4 block"
                >
                  <div className="mb-4">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                      {(() => {
                        const coverData = getCoverImage(
                          mainArticle.cover as {
                            source?: "asset" | "external";
                            externalUrl?: string | null;
                            image?: any;
                            alt?: string | null;
                          } | null,
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
                    {/* {formatImageCredit(mainArticle.cover) && (
                      <p className="text-[10px] text-gray-500 font-sans text-right">
                        {formatImageCredit(mainArticle.cover)}
                      </p>
                    )} */}
                  </div>
                  <h3 className="font-sans font-semibold text-2xl text-neutral-900 leading-snug tracking-tight">
                    {mainArticle.title || "Untitled"}
                  </h3>
                </Link>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {secondaryArticles[0] && (
                  <Link
                    href={`/post/${secondaryArticles[0].slug || "#"}`}
                    className="group block"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[4/3]">
                        {(() => {
                          const coverData = getImageData(
                            secondaryArticles[0].cover,
                            secondaryArticles[0].title || "Article image",
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
                              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 300px"
                              className="rounded-sm object-cover"
                            />
                          );
                        })()}
                      </div>
                      {/* {formatImageCredit(secondaryArticles[0].cover) && (
                        <p className="text-[10px] text-gray-500 font-sans text-right">
                          {formatImageCredit(secondaryArticles[0].cover)}
                        </p>
                      )} */}
                    </div>
                    <div className="mt-2">
                      <h3 className="font-sans font-semibold text-neutral-900 text-xl leading-snug tracking-tight">
                        {secondaryArticles[0].title || "Untitled"}
                      </h3>
                    </div>
                  </Link>
                )}

                {secondaryArticles[1] && (
                  <Link
                    href={`/post/${secondaryArticles[1].slug || "#"}`}
                    className="group block"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden rounded-sm sm:aspect-[4/3]">
                        {(() => {
                          const coverData = getImageData(
                            secondaryArticles[1].cover,
                            secondaryArticles[1].title || "Article image",
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
                              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 300px"
                              className="rounded-sm object-cover"
                            />
                          );
                        })()}
                      </div>
                      {/* {formatImageCredit(secondaryArticles[1].cover) && (
                        <p className="text-[10px] text-gray-500 font-sans text-right">
                          {formatImageCredit(secondaryArticles[1].cover)}
                        </p>
                      )} */}
                    </div>
                    <div className="mt-2">
                      <h3 className="font-sans font-semibold text-neutral-900 text-xl leading-snug tracking-tight">
                        {secondaryArticles[1].title || "Untitled"}
                      </h3>
                    </div>
                  </Link>
                )}
              </div>

              {/* Separator after secondary articles */}
              <hr className="my-4 border-gray-300 border-t lg:hidden" />
            </div>

            {/* Right Column - Full width on mobile (appears after left), 5 columns on desktop */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
              {/* Left sidebar column */}
              <div className="flex flex-col gap-0">
                {rightColumnArticles[0] && (
                  <>
                    <Link
                      href={`/post/${rightColumnArticles[0].slug || "#"}`}
                      className="group block"
                    >
                      <div>
                        <div className="relative aspect-[16/9] overflow-hidden rounded-sm lg:aspect-[3/4]">
                          {(() => {
                            const coverData = getImageData(
                              rightColumnArticles[0].cover,
                              rightColumnArticles[0].title || "Article image",
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
                                className="rounded-sm object-cover"
                              />
                            );
                          })()}
                        </div>
                        {/* {formatImageCredit(rightColumnArticles[0].cover) && (
                          <p className="text-[10px] text-gray-500 font-sans text-right">
                            {formatImageCredit(rightColumnArticles[0].cover)}
                          </p>
                        )} */}
                      </div>
                      <div className="mt-2">
                        <h3 className="font-sans font-semibold text-neutral-900 text-xl leading-snug tracking-tight">
                          {rightColumnArticles[0].title || "Untitled"}
                        </h3>
                      </div>
                    </Link>
                    {/* Separator after featured article */}
                    <hr className="my-3 border-gray-300 border-t" />
                  </>
                )}

                {/* Text-only article links */}
                <div className="flex flex-col gap-4">
                  {rightColumnArticles.slice(1, 5).map((article, index) => (
                    <div key={article._id}>
                      <Link
                        href={`/post/${article.slug || "#"}`}
                        className="font-normal font-sans text-base text-neutral-900 leading-snug tracking-normal"
                      >
                        {article.title || "Untitled"}
                      </Link>
                      {index < 3 && (
                        <hr className="mt-4 border-gray-300 border-t" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right sidebar column */}
              <div className="flex flex-col gap-0">
                {rightColumnArticles[
                  Math.ceil(rightColumnArticles.length / 2)
                ] && (
                  <>
                    <Link
                      href={`/post/${rightColumnArticles[Math.ceil(rightColumnArticles.length / 2)].slug || "#"}`}
                      className="group block"
                    >
                      <div>
                        <div className="relative aspect-[16/9] overflow-hidden rounded-sm lg:aspect-[3/4]">
                          {(() => {
                            const midIndex = Math.ceil(
                              rightColumnArticles.length / 2,
                            );
                            const coverData = getImageData(
                              rightColumnArticles[midIndex].cover,
                              rightColumnArticles[midIndex].title ||
                                "Article image",
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
                                className="rounded-sm object-cover"
                              />
                            );
                          })()}
                        </div>
                        {/* {formatImageCredit(
                          rightColumnArticles[
                            Math.ceil(rightColumnArticles.length / 2)
                          ]?.cover
                        ) && (
                          <p className="text-[10px] text-gray-500 font-sans text-right">
                            {formatImageCredit(
                              rightColumnArticles[
                                Math.ceil(rightColumnArticles.length / 2)
                              ]?.cover
                            )}
                          </p>
                        )} */}
                      </div>
                      <div className="mt-2">
                        <h3 className="font-sans font-semibold text-neutral-900 text-xl leading-snug tracking-tight">
                          {rightColumnArticles[
                            Math.ceil(rightColumnArticles.length / 2)
                          ].title || "Untitled"}
                        </h3>
                      </div>
                    </Link>
                    {/* Separator after featured article */}
                    <hr className="my-3 border-gray-300 border-t" />
                  </>
                )}

                {/* Text-only article links */}
                <div className="flex flex-col gap-4">
                  {rightColumnArticles.slice(7, 12).map((article, index) => (
                    <div key={article._id}>
                      <Link
                        href={`/post/${article.slug || "#"}`}
                        className="font-normal font-sans text-base text-neutral-900 leading-snug tracking-normal"
                      >
                        {article.title || "Untitled"}
                      </Link>
                      {index < 3 && (
                        <hr className="mt-4 border-gray-300 border-t" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { FourthSectionQueryResult } from "@/sanity.types";
import { getCoverImage } from "@/sanity/lib/utils";

interface MainThirdSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
}

export default function MainThirdSection({
  posts,
  categoryTitle,
}: MainThirdSectionProps) {
  // Helper function to get image data from cover
  const getImageData = (cover: any, fallbackTitle: string = "Article") => {
    const coverData = getCoverImage(cover, fallbackTitle);
    return coverData ? coverData.src : "/placeholder.svg";
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
      <div className="px-4">
        <div className="grid grid-cols-12 gap-0">
          {/* Section Header */}
          <div className="col-span-12 mb-4">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-sans">
                <Link
                  href={`/category/${categoryTitle.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  {categoryTitle}
                </Link>
              </h2>
            </div>
            <div className="border-t border-black mb-6"></div>
          </div>

          <div className="col-span-12 flex flex-col lg:grid lg:grid-cols-12 gap-3">
            {/* Left Column - Full width on mobile, 7 columns on desktop */}
            <div className="w-full lg:col-span-7 flex flex-col gap-3">
              {mainArticle && (
                <Link
                  href={`/post/${mainArticle.slug || "#"}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-3">
                    <Image
                      src={getImageData(
                        mainArticle.cover,
                        mainArticle.title || "Featured article"
                      )}
                      alt={mainArticle.title || "Featured article"}
                      fill
                      unoptimized={
                        getCoverImage(
                          mainArticle.cover as {
                            source?: "asset" | "external";
                            externalUrl?: string | null;
                            image?: any;
                            alt?: string | null;
                          } | null,
                          mainArticle.title || "Featured article"
                        )?.unoptimized || false
                      }
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-black text-2xl tracking-wide font-semibold leading-tight font-sans">
                    {mainArticle.title || "Untitled"}
                  </h3>
                </Link>
              )}

              {/* Separator after main article */}
              <hr className="border-t border-gray-300 my-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secondaryArticles[0] && (
                  <Link
                    href={`/post/${secondaryArticles[0].slug || "#"}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={getImageData(
                          secondaryArticles[0].cover,
                          secondaryArticles[0].title || "Article image"
                        )}
                        alt={secondaryArticles[0].title || "Article image"}
                        fill
                        unoptimized={
                          getCoverImage(
                            secondaryArticles[0].cover as {
                              source?: "asset" | "external";
                              externalUrl?: string | null;
                              image?: any;
                              alt?: string | null;
                            } | null,
                            secondaryArticles[0].title || "Article image"
                          )?.unoptimized || false
                        }
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-lg font-semibold leading-tight mt-1 tracking-wide font-sans">
                        {secondaryArticles[0].title || "Untitled"}
                      </h4>
                    </div>
                  </Link>
                )}

                {secondaryArticles[1] && (
                  <Link
                    href={`/post/${secondaryArticles[1].slug || "#"}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={getImageData(
                          secondaryArticles[1].cover,
                          secondaryArticles[1].title || "Article image"
                        )}
                        alt={secondaryArticles[1].title || "Article image"}
                        fill
                        unoptimized={
                          getCoverImage(
                            secondaryArticles[1].cover as {
                              source?: "asset" | "external";
                              externalUrl?: string | null;
                              image?: any;
                              alt?: string | null;
                            } | null,
                            secondaryArticles[1].title || "Article image"
                          )?.unoptimized || false
                        }
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-lg font-semibold leading-tight mt-1 tracking-wide font-sans">
                        {secondaryArticles[1].title || "Untitled"}
                      </h4>
                    </div>
                  </Link>
                )}
              </div>

              {/* Separator after secondary articles */}
              <hr className="border-t border-gray-300 my-4 lg:hidden" />
            </div>

            {/* Right Column - Full width on mobile (appears after left), 5 columns on desktop */}
            <div className="w-full lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {/* Left sidebar column */}
              <div className="flex flex-col gap-4">
                {rightColumnArticles[0] && (
                  <>
                    <Link
                      href={`/post/${rightColumnArticles[0].slug || "#"}`}
                      className="group block"
                    >
                      <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden rounded-xl">
                        <Image
                          src={getImageData(
                            rightColumnArticles[0].cover,
                            rightColumnArticles[0].title || "Article image"
                          )}
                          alt={rightColumnArticles[0].title || "Article image"}
                          fill
                          unoptimized={
                            getCoverImage(
                              rightColumnArticles[0].cover as {
                                source?: "asset" | "external";
                                externalUrl?: string | null;
                                image?: any;
                                alt?: string | null;
                              } | null,
                              rightColumnArticles[0].title || "Article image"
                            )?.unoptimized || false
                          }
                          className="object-cover rounded-xl"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-lg font-semibold leading-tight mt-1 tracking-wide font-sans">
                          {rightColumnArticles[0].title || "Untitled"}
                        </h4>
                      </div>
                    </Link>
                    {/* Separator after featured article */}
                    <hr className="border-t border-gray-300 my-3" />
                  </>
                )}

                {/* Text-only article links */}
                <div className="flex flex-col gap-4">
                  {rightColumnArticles.slice(1, 5).map((article, index) => (
                    <div key={article._id}>
                      <Link
                        href={`/post/${article.slug || "#"}`}
                        className="text-sm font-semibold leading-tight mt-1 tracking-wide font-sans block"
                      >
                        {article.title || "Untitled"}
                      </Link>
                      {index < 3 && (
                        <hr className="border-t border-gray-300 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right sidebar column */}
              <div className="flex flex-col gap-4">
                {rightColumnArticles[
                  Math.ceil(rightColumnArticles.length / 2)
                ] && (
                  <>
                    <Link
                      href={`/post/${rightColumnArticles[Math.ceil(rightColumnArticles.length / 2)].slug || "#"}`}
                      className="group block"
                    >
                      <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden rounded-xl">
                        <Image
                          src={getImageData(
                            rightColumnArticles[
                              Math.ceil(rightColumnArticles.length / 2)
                            ].cover,
                            rightColumnArticles[
                              Math.ceil(rightColumnArticles.length / 2)
                            ].title || "Article image"
                          )}
                          alt={
                            rightColumnArticles[
                              Math.ceil(rightColumnArticles.length / 2)
                            ].title || "Article image"
                          }
                          fill
                          unoptimized={
                            getCoverImage(
                              rightColumnArticles[
                                Math.ceil(rightColumnArticles.length / 2)
                              ].cover as {
                                source?: "asset" | "external";
                                externalUrl?: string | null;
                                image?: any;
                                alt?: string | null;
                              } | null,
                              rightColumnArticles[
                                Math.ceil(rightColumnArticles.length / 2)
                              ].title || "Article image"
                            )?.unoptimized || false
                          }
                          className="object-cover rounded-xl"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-lg font-semibold leading-tight mt-1 tracking-wide font-sans">
                          {rightColumnArticles[
                            Math.ceil(rightColumnArticles.length / 2)
                          ].title || "Untitled"}
                        </h4>
                      </div>
                    </Link>
                    {/* Separator after featured article */}
                    <hr className="border-t border-gray-300 my-3" />
                  </>
                )}

                {/* Text-only article links */}
                <div className="flex flex-col gap-4">
                  {rightColumnArticles.slice(7, 12).map((article, index) => (
                    <div key={article._id}>
                      <Link
                        href={`/post/${article.slug || "#"}`}
                        className="text-sm font-semibold leading-tight mt-1 tracking-wide font-sans block"
                      >
                        {article.title || "Untitled"}
                      </Link>
                      {index < 3 && (
                        <hr className="border-t border-gray-300 mt-4" />
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

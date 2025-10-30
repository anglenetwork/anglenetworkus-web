import Image from "next/image";
import Link from "next/link";
import { FourthSectionQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface MainThirdSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
}

export default function MainThirdSection({
  posts,
  categoryTitle,
}: MainThirdSectionProps) {
  // Helper function to get image URL from Sanity image
  const getImageUrl = (coverImage: any) => {
    const imageUrl = urlForImage(coverImage);
    return imageUrl ? imageUrl.url() : "/placeholder.svg";
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
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
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
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                    <Image
                      src={getImageUrl(mainArticle.coverImage)}
                      alt={mainArticle.title || "Featured article"}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white text-2xl tracking-wide font-semibold leading-tight font-sans">
                        {mainArticle.title || "Untitled"}
                      </h3>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secondaryArticles[0] && (
                  <Link
                    href={`/post/${secondaryArticles[0].slug || "#"}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={getImageUrl(secondaryArticles[0].coverImage)}
                        alt={secondaryArticles[0].title || "Article image"}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-base font-semibold leading-tight mt-1 tracking-wide font-sans">
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
                        src={getImageUrl(secondaryArticles[1].coverImage)}
                        alt={secondaryArticles[1].title || "Article image"}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-base font-semibold leading-tight mt-1 tracking-wide font-sans">
                        {secondaryArticles[1].title || "Untitled"}
                      </h4>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column - Full width on mobile (appears after left), 5 columns on desktop */}
            <div className="w-full lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              {/* Left sidebar column */}
              <div className="flex flex-col gap-4">
                {rightColumnArticles[0] && (
                  <Link
                    href={`/post/${rightColumnArticles[0].slug || "#"}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden rounded-xl">
                      <Image
                        src={getImageUrl(rightColumnArticles[0].coverImage)}
                        alt={rightColumnArticles[0].title || "Article image"}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold leading-tight mt-1 tracking-wide font-sans">
                        {rightColumnArticles[0].title || "Untitled"}
                      </h4>
                    </div>
                  </Link>
                )}

                {/* Separator between featured article and text links */}
                <div className="border-t border-neutral-200 mt-1"></div>

                {/* Text-only article links */}
                <div className="flex flex-col gap-4">
                  {rightColumnArticles.slice(1, 5).map((article, index) => (
                    <div key={article._id}>
                      <Link
                        href={`/post/${article.slug || "#"}`}
                        className="text-sm font-semibold leading-tight mt-1 tracking-wide font-sans"
                      >
                        {article.title || "Untitled"}
                      </Link>
                      {index < 3 && (
                        <div className="border-t border-neutral-200 mt-4"></div>
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
                  <Link
                    href={`/post/${rightColumnArticles[Math.ceil(rightColumnArticles.length / 2)].slug || "#"}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden rounded-xl">
                      <Image
                        src={getImageUrl(
                          rightColumnArticles[
                            Math.ceil(rightColumnArticles.length / 2)
                          ].coverImage
                        )}
                        alt={
                          rightColumnArticles[
                            Math.ceil(rightColumnArticles.length / 2)
                          ].title || "Article image"
                        }
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold leading-tight mt-1 tracking-wide font-sans">
                        {rightColumnArticles[
                          Math.ceil(rightColumnArticles.length / 2)
                        ].title || "Untitled"}
                      </h4>
                    </div>
                  </Link>
                )}

                {/* Separator between featured article and text links */}
                <div className="border-t border-neutral-200 mt-1"></div>

                {/* Text-only article links */}
                <div className="flex flex-col gap-4">
                  {rightColumnArticles.slice(7, 12).map((article, index) => (
                    <div key={article._id}>
                      <Link
                        href={`/post/${article.slug || "#"}`}
                        className="text-sm font-semibold leading-tight mt-1 tracking-wide font-sans"
                      >
                        {article.title || "Untitled"}
                      </Link>
                      {index < 3 && (
                        <div className="border-t border-neutral-200 mt-4"></div>
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

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCoverImage, formatImageCredit } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
  date: string;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface CategoryData {
  slug: string | null;
  name: string | null;
  posts: Post[];
}

interface MainFourthSectionProps {
  categoriesData: CategoryData[];
  variant?: "light" | "dark";
}

export default function MainFourthSection({
  categoriesData,
  variant = "light",
}: MainFourthSectionProps) {
  // Filter out categories without required data and limit to 3 posts per category
  const validCategories = categoriesData
    .filter(
      (category) => category.slug && category.name && category.posts.length > 0
    )
    .map((category) => ({
      ...category,
      posts: category.posts.slice(0, 3), // Take only the first 3 posts
    }));

  return (
    <main
      className={`p-10 rounded-lg ${variant === "dark" ? "bg-black" : "bg-background"}`}
    >
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {validCategories.map((category, index) => {
            const [mainPost, secondPost, thirdPost] = category.posts;

            return (
              <article key={category.slug} className="space-y-4">
                {/* Category Header */}
                <SectionHeader
                  title={category.name || "Category"}
                  variant={variant}
                  href={
                    category.slug ? `/category/${category.slug}` : undefined
                  }
                />
                <div className="mb-6"></div>

                {/* Featured Image */}
                <div className="mt-4">
                  {(() => {
                    const coverData = getCoverImage(
                      mainPost?.cover,
                      mainPost?.title || "Article image"
                    );
                    if (coverData?.src) {
                      return (
                        <>
                          <Link
                            href={`/post/${mainPost.slug}`}
                            className="block"
                            aria-label={`Read article: ${mainPost?.title || "Featured article"}`}
                          >
                            <div className="overflow-hidden rounded-sm bg-black">
                              <Image
                                src={coverData.src}
                                alt={coverData.alt}
                                width={800}
                                height={300}
                                unoptimized={coverData.unoptimized}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 800px"
                                className="h-[300px] w-full object-cover rounded-sm"
                              />
                            </div>
                          </Link>
                          {formatImageCredit(mainPost?.cover) && (
                            <p
                              className={`text-[10px] font-secondary text-right ${variant === "dark" ? "text-gray-400" : "text-gray-500"}`}
                            >
                              {formatImageCredit(mainPost?.cover)}
                            </p>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Main Article */}
                {mainPost && mainPost.slug && (
                  <div className="space-y-2">
                    <Link href={`/post/${mainPost.slug}`}>
                      <h3
                        className={`text-xl font-sans font-semibold leading-snug tracking-tight ${variant === "dark" ? "text-white" : "text-neutral-900"}`}
                      >
                        {mainPost.title}
                      </h3>
                    </Link>
                  </div>
                )}

                {/* Divider */}
                <hr
                  className={`border-t ${variant === "dark" ? "border-white" : "border-neutral-200"}`}
                />

                {/* Related Articles */}
                <div className="space-y-4">
                  {secondPost && secondPost.slug && (
                    <>
                      <Link href={`/post/${secondPost.slug}`}>
                        <h3
                          className={`text-base font-sans font-normal leading-snug mb-4 ${variant === "dark" ? "text-white" : "text-neutral-900"}`}
                        >
                          {secondPost.title}
                        </h3>
                      </Link>
                    </>
                  )}
                  {thirdPost && thirdPost.slug && (
                    <Link href={`/post/${thirdPost.slug}`}>
                      <hr
                        className={`border-1 my-4 ${variant === "dark" ? "border-white" : "border-neutral-200"}`}
                      />
                      <h3
                        className={`leading-snug mb-2 font-sans text-base font-normal ${variant === "dark" ? "text-white" : "text-neutral-900"}`}
                      >
                        {thirdPost.title}
                      </h3>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

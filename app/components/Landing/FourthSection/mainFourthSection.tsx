import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCoverImage } from "@/sanity/lib/utils";

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
}

export default function MainFourthSection({
  categoriesData,
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
    <main className="bg-background px-4 border-2 border-yellow-200">
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {validCategories.map((category, index) => {
            const [mainPost, secondPost, thirdPost] = category.posts;

            return (
              <article key={category.slug} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
                    {category.name}
                  </h2>
                </div>
                <div className="border-b border-gray-300 mb-10"></div>

                {/* Featured Image */}
                <Link href={`/post/${mainPost.slug}`} className="block mt-4">
                  {(() => {
                    const coverData = getCoverImage(
                      mainPost?.cover,
                      mainPost?.title || "Article image"
                    );
                    if (coverData?.src) {
                      return (
                        <div className="relative overflow-hidden rounded-sm bg-black">
                          <Image
                            src={coverData.src}
                            alt={coverData.alt}
                            width={800}
                            height={300}
                            unoptimized={coverData.unoptimized}
                            className="h-[300px] w-full object-cover rounded-sm"
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </Link>

                {/* Main Article */}
                {mainPost && mainPost.slug && (
                  <div className="space-y-2">
                    <Link href={`/post/${mainPost.slug}`}>
                      <h1 className="text-neutral-900 leading-normal mb-2 font-sans text-lg font-semibold tracking-wide">
                        {mainPost.title}
                      </h1>
                    </Link>
                  </div>
                )}

                {/* Divider */}
                <hr className="border-t border-neutral-200" />

                {/* Related Articles */}
                <div className="space-y-4">
                  {secondPost && secondPost.slug && (
                    <>
                      <Link href={`/post/${secondPost.slug}`}>
                        <h3 className="text-neutral-900 leading-normal font-sans text-base font-medium tracking-wide mb-4">
                          {secondPost.title}
                        </h3>
                      </Link>
                    </>
                  )}
                  {thirdPost && thirdPost.slug && (
                    <Link href={`/post/${thirdPost.slug}`}>
                      <hr className="border-1 border-neutral-200 my-4" />
                      <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-base font-medium tracking-wide">
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

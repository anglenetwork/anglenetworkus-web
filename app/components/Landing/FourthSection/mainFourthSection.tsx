import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCoverImage } from "@/sanity/lib/utils";
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
    <main className="bg-background px-4">
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {validCategories.map((category, index) => {
            const [mainPost, secondPost, thirdPost] = category.posts;

            return (
              <article key={category.slug} className="space-y-4">
                {/* Category Header */}
                <SectionHeader
                  title={category.name || "Category"}
                  variant="gradient"
                  href={
                    category.slug ? `/category/${category.slug}` : undefined
                  }
                />
                <div className="mb-6"></div>

                {/* Featured Image */}
                <Link 
                  href={`/post/${mainPost.slug}`} 
                  className="block mt-4"
                  aria-label={`Read article: ${mainPost?.title || "Featured article"}`}
                >
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
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 800px"
                            className="h-[300px] w-full object-cover rounded-sm"
                          />
                          {mainPost?.cover?.imageSource && (
                            <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                              {mainPost.cover.imageSource}
                            </div>
                          )}
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
                      <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-lg font-medium tracking-wide">
                        {mainPost.title}
                      </h3>
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
                        <h3 className="text-neutral-900 leading-normal font-sans text-base font-normal tracking-wide mb-4">
                          {secondPost.title}
                        </h3>
                      </Link>
                    </>
                  )}
                  {thirdPost && thirdPost.slug && (
                    <Link href={`/post/${thirdPost.slug}`}>
                      <hr className="border-1 border-neutral-200 my-4" />
                      <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-base font-normal tracking-wide">
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

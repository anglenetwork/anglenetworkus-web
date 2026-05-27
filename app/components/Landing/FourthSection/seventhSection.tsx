import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ListingPhotoCredit } from "@/app/helpers";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  categoryColumnSecondaryTitle,
  categoryColumnTertiaryTitle,
  categoryFeaturedTitle,
} from "@/app/lib/typography/second-section";

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
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
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

interface SeventhSectionProps {
  categoriesData: CategoryData[];
  variant?: "light" | "dark";
}

export default function SeventhSection({
  categoriesData,
  variant = "light",
}: SeventhSectionProps) {
  // Filter out categories without required data and limit to 3 posts per category
  const validCategories = categoriesData
    .filter(
      (category) => category.slug && category.name && category.posts.length > 0,
    )
    .map((category) => ({
      ...category,
      posts: category.posts.slice(0, 3), // Take only the first 3 posts
    }));

  return (
    <main
      className={`rounded-lg p-10 ${variant === "dark" ? "bg-black" : "bg-background"}`}
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
                  accentStyle="geometric-square"
                  size="large"
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
                      mainPost?.title || "Article image",
                    );
                    if (coverData?.src) {
                      return (
                        <>
                          <Link
                            href={`/post/${mainPost.slug}`}
                            className="block"
                            aria-label={`Read article: ${mainPost?.title || "Featured article"}`}
                          >
                            <div className="relative h-[300px] w-full overflow-hidden rounded-sm bg-black">
                              <ImageRenderer
                                src={coverData.src}
                                alt={coverData.alt}
                                width={800}
                                height={300}
                                unoptimized={coverData.unoptimized}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 400px"
                                className="rounded-sm object-cover object-center"
                                fill
                              />
                            </div>
                          </Link>
                          <ListingPhotoCredit
                            cover={mainPost?.cover}
                            align="right"
                          />
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
                      <h3 className={categoryFeaturedTitle[variant]}>
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
                        <h3 className={categoryColumnSecondaryTitle[variant]}>
                          {secondPost.title}
                        </h3>
                      </Link>
                    </>
                  )}
                  {thirdPost && thirdPost.slug && (
                    <Link href={`/post/${thirdPost.slug}`}>
                      <hr
                        className={`my-4 border-1 ${variant === "dark" ? "border-white" : "border-neutral-200"}`}
                      />
                      <h3 className={categoryColumnTertiaryTitle[variant]}>
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

import Link from "next/link";
import { ListingPhotoCredit } from "@/app/helpers";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
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

interface SecondSectionProps {
  categoriesData: CategoryData[];
  variant?: "light" | "dark";
}

function SecondSectionSecondaryRow({
  post,
  variant,
}: {
  post: Post;
  variant: "light" | "dark";
}) {
  if (!post.slug) return null;

  const coverData = getCoverImage(post.cover, post.title || "Article image");
  const titleClass = categorySecondaryRowTitle[variant];

  return (
    <Link href={`/post/${post.slug}`} className="group flex items-start gap-3">
      {coverData?.src ? (
        <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-sm bg-neutral-950">
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={112}
            height={80}
            unoptimized={coverData.unoptimized}
            sizes="112px"
            className="rounded-sm object-cover object-center"
            fill
          />
        </div>
      ) : null}
      <h3 className={titleClass}>{post.title}</h3>
    </Link>
  );
}

export default function SecondSection({
  categoriesData,
  variant = "light",
}: SecondSectionProps) {
  // Filter out categories without required data and limit to 2 posts per category
  const validCategories = categoriesData.reduce<CategoryData[]>(
    (acc, category) => {
      if (category.slug && category.name && category.posts.length > 0) {
        acc.push({ ...category, posts: category.posts.slice(0, 2) });
      }
      return acc;
    },
    [],
  );

  return (
    <main
      className={`rounded-lg ${
        variant === "dark" ? "bg-neutral-950" : "bg-background"
      }`}
    >
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {validCategories.map((category, index) => {
            const [mainPost, secondPost] = category.posts;

            return (
              <article key={category.slug} className="space-y-4">
                {/* Category Header */}
                <SectionHeader
                  title={category.name || "Category"}
                  variant={variant}
                  accentStyle="small-dot"
                  size="regular"
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
                            <div className="relative h-[300px] w-full overflow-hidden rounded-sm bg-neutral-950">
                              <ImageRenderer
                                src={coverData.src}
                                alt={coverData.alt}
                                width={800}
                                height={300}
                                unoptimized={coverData.unoptimized}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
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

                {secondPost?.slug ? (
                  <SecondSectionSecondaryRow
                    post={secondPost}
                    variant={variant}
                  />
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

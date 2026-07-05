import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingPhotoCredit } from "@/app/helpers";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

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
  readTime?: number | null;
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
  variant?: "news" | "dark";
}

function SecondSectionSecondaryRow({
  post,
  variant,
}: {
  post: Post;
  variant: "news" | "dark";
}) {
  if (!post.slug) return null;

  const coverData = getHomepageCoverImage(
    "sectionThumb",
    post.cover,
    post.title || "Article image",
  );

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex items-start gap-3"
      aria-label={`Read article: ${post.title}`}
    >
      <div className="min-w-0 flex-1">
        <h3 className={categorySecondaryRowTitle[variant]}>{post.title}</h3>
        <ReadTimeLabel minutes={post.readTime} variant={variant} />
      </div>
      {coverData?.src ? (
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={112}
            height={80}
            unoptimized={coverData.unoptimized}
            sizes="112px"
            className="object-cover object-center"
          />
        </div>
      ) : null}
    </Link>
  );
}

export default function SecondSection({
  categoriesData,
  variant = "news",
}: SecondSectionProps) {
  const validCategories = categoriesData.reduce<CategoryData[]>(
    (acc, category) => {
      if (category.slug && category.name && category.posts.length > 0) {
        acc.push({ ...category, posts: category.posts.slice(0, 2) });
      }
      return acc;
    },
    [],
  );

  const dividerClass =
    variant === "dark" ? "border-white/30" : "border-news-border";
  const divideClass =
    variant === "dark" ? "divide-white/30" : "divide-news-border";

  return (
    <main
      className={cn(
        "rounded-lg",
        variant === "dark" ? "bg-news-secondary" : "bg-news-surface",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-dotted lg:grid-cols-3 lg:divide-x lg:divide-y-0",
          divideClass,
        )}
      >
        {validCategories.map((category) => {
          const [mainPost, secondPost] = category.posts;

          return (
            <article
              key={category.slug}
              className="space-y-4 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
            >
              <SectionHeader
                title={category.name || "Category"}
                href={`/category/${category.slug}`}
                variant={variant}
                accentStyle="minimal"
              />

              {(() => {
                const coverData = getHomepageCoverImage(
                  "sectionFeatured",
                  mainPost?.cover,
                  mainPost?.title || "Article image",
                );
                if (!coverData?.src || !mainPost?.slug) return null;

                return (
                  <div>
                    <Link
                      href={`/post/${mainPost.slug}`}
                      className="group block"
                      aria-label={`Read article: ${mainPost.title || "Featured article"}`}
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary">
                        <ImageRenderer
                          src={coverData.src}
                          alt={coverData.alt}
                          width={800}
                          height={450}
                          unoptimized={coverData.unoptimized}
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover object-center"
                          fill
                        />
                      </div>
                    </Link>
                    <ListingPhotoCredit cover={mainPost.cover} align="right" />
                    <Link
                      href={`/post/${mainPost.slug}`}
                      className="group block"
                    >
                      <h3
                        className={cn("mt-4", categoryFeaturedTitle[variant])}
                      >
                        {mainPost.title}
                      </h3>
                    </Link>
                    <ReadTimeLabel
                      minutes={mainPost.readTime}
                      variant={variant}
                    />
                  </div>
                );
              })()}

              <hr className={cn("border-t border-dotted", dividerClass)} />

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
    </main>
  );
}

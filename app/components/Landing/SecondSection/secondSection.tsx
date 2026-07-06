import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatImageCredit } from "@/sanity/lib/utils";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import {
  sectionGridCellClassName,
  sectionGridClassName,
  sectionLeadImageClassName,
} from "@/app/lib/homepage/section-grid-cells";
import {
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
  moreSectionsHeading,
  secCategoryLabel,
  secMainHeadline,
  secPhotoCredit,
  secSubHeadline,
} from "@/app/lib/typography/second-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "../../ui/image-renderer";

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

  if (variant === "dark") {
    return (
      <Link
        href={`/post/${post.slug}`}
        className="group flex items-start gap-3"
        aria-label={`Read article: ${post.title}`}
      >
        <div className="min-w-0 flex-1">
          <h3 className={categorySecondaryRowTitle.dark}>{post.title}</h3>
          <ReadTimeLabel minutes={post.readTime} variant="dark" />
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

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group divider-dashed mt-[26px] flex items-start justify-between gap-4 pt-[22px]"
      aria-label={`Read article: ${post.title}`}
    >
      <div className="min-w-0 flex-1">
        <h3 className={secSubHeadline}>{post.title}</h3>
        <ReadTimeLabel
          minutes={post.readTime}
          variant="angle"
          className="mt-2.5"
        />
      </div>
      {coverData?.src ? (
        <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden bg-angle-paper">
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={64}
            height={64}
            fill
            unoptimized={coverData.unoptimized}
            sizes="64px"
            className="object-cover object-center"
          />
        </div>
      ) : null}
    </Link>
  );
}

function SecondSectionLeadStory({
  post,
  variant,
}: {
  post: Post;
  variant: "news" | "dark";
}) {
  const coverData = getHomepageCoverImage(
    "sectionFeatured",
    post.cover,
    post.title || "Article image",
  );
  if (!coverData?.src || !post.slug) return null;

  const credit = formatImageCredit(post.cover);

  if (variant === "dark") {
    return (
      <div>
        <Link
          href={`/post/${post.slug}`}
          className="group block"
          aria-label={`Read article: ${post.title || "Featured article"}`}
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
        <Link href={`/post/${post.slug}`} className="group block">
          <h3 className={cn("mt-4", categoryFeaturedTitle.dark)}>
            {post.title}
          </h3>
        </Link>
        <ReadTimeLabel minutes={post.readTime} variant="dark" />
      </div>
    );
  }

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block"
      aria-label={`Read article: ${post.title || "Featured article"}`}
    >
      <div className={sectionLeadImageClassName("4/3")}>
        <ImageRenderer
          src={coverData.src}
          alt={coverData.alt}
          width={700}
          height={525}
          unoptimized={coverData.unoptimized}
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
          className="object-cover object-center"
          fill
        />
      </div>
      {credit ? <p className={secPhotoCredit}>{credit}</p> : null}
      <h3 className={secMainHeadline}>{post.title}</h3>
      <ReadTimeLabel minutes={post.readTime} variant="angle" />
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

  if (validCategories.length === 0) {
    return null;
  }

  if (variant === "dark") {
    return (
      <main className="rounded-lg bg-news-secondary">
        <div className="grid grid-cols-1 divide-y divide-dotted divide-white/30 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {validCategories.map((category) => {
            const [mainPost, secondPost] = category.posts;
            return (
              <article
                key={category.slug}
                className="space-y-4 py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0"
              >
                <h2 className="font-bold font-sans text-base text-white uppercase tracking-normal">
                  {category.name || "Category"}
                </h2>
                {mainPost ? (
                  <SecondSectionLeadStory post={mainPost} variant="dark" />
                ) : null}
                <hr className="border-white/30 border-t border-dotted" />
                {secondPost?.slug ? (
                  <SecondSectionSecondaryRow post={secondPost} variant="dark" />
                ) : null}
              </article>
            );
          })}
        </div>
      </main>
    );
  }

  return (
    <section aria-label="More sections">
      <div className="mb-9 flex items-baseline gap-[18px]">
        <h2 className={moreSectionsHeading}>More Sections</h2>
        <div className="h-px flex-1 bg-angle-hairline" aria-hidden />
      </div>

      <div className={sectionGridClassName()}>
        {validCategories.map((category) => {
          const [mainPost, secondPost] = category.posts;

          return (
            <article key={category.slug} className={sectionGridCellClassName()}>
              <Link
                href={`/category/${category.slug}`}
                className={secCategoryLabel}
              >
                {category.name || "Category"}
              </Link>

              {mainPost ? (
                <SecondSectionLeadStory post={mainPost} variant="news" />
              ) : null}

              {secondPost?.slug ? (
                <SecondSectionSecondaryRow post={secondPost} variant="news" />
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

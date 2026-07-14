import Link from "next/link";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";
import { ARTICLE_IMAGE_FRAME_CLASS } from "./PostBody/constants";
import {
  postRelatedClassicHeroTitle,
  postRelatedClassicListTitle,
  postRelatedModernCardCategory,
  postRelatedModernCardReadTime,
  postRelatedModernCardTitle,
  postRelatedModernRailDate,
  postRelatedModernRailEyebrow,
  postRelatedModernSectionTitle,
  postRelatedModernSideTitle,
  postRelatedModernViewAllLink,
} from "@/app/lib/typography/post-page";
import { cn } from "@/lib/utils";

type BottomArticleModuleVariant = "classic" | "modern";

/** Classic: 1 hero + up to 6 list items. Modern: 6 grid cards + 4 sidebar items. */
const RELATED_MODULE_CLASSIC_TOTAL = 7;
export const RELATED_MODULE_MODERN_TOTAL = 10;

interface BottomArticleModuleProps {
  posts: ArticleSidebarPost[];
  variant?: BottomArticleModuleVariant;
  /** Modern variant: label for "More in {category}" (e.g. "AI"). */
  categoryName?: string;
  /** Modern variant: optional href for the category label link. */
  categoryHref?: string;
}

export default function BottomArticleModule({
  posts,
  variant = "classic",
  categoryName,
  categoryHref,
}: BottomArticleModuleProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  if (variant === "modern") {
    return (
      <ModernRelatedArticles
        posts={posts.slice(0, RELATED_MODULE_MODERN_TOTAL)}
        categoryName={categoryName}
        categoryHref={categoryHref}
      />
    );
  }

  return (
    <ClassicRelatedArticles
      posts={posts.slice(0, RELATED_MODULE_CLASSIC_TOTAL)}
    />
  );
}

function ClassicRelatedArticles({ posts }: { posts: ArticleSidebarPost[] }) {
  return (
    <div className="">
      <div className="px-0 py-12">
        <SectionHeader
          title="Related Articles"
          variant="light"
          accentStyle="modern"
          icon={false}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-[60%]">
            {posts[0] && (
              <Link href={posts[0].href} className="group block">
                <div
                  className={`relative aspect-[16/10] w-full ${ARTICLE_IMAGE_FRAME_CLASS}`}
                >
                  {(() => {
                    const coverData = getCoverImage(
                      posts[0].cover as Parameters<typeof getCoverImage>[0],
                      posts[0].title || "Article image",
                      800,
                    );
                    if (coverData?.src) {
                      return (
                        <ImageRenderer
                          src={coverData.src}
                          alt={coverData.alt}
                          width={1200}
                          height={750}
                          fill
                          quality={50}
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          unoptimized={coverData.unoptimized}
                          className="object-cover transition-opacity group-hover:opacity-90"
                        />
                      );
                    }
                    return (
                      <div className="flex size-full items-center justify-center bg-news-border">
                        <span className="text-news-muted">No Image</span>
                      </div>
                    );
                  })()}
                </div>
                <h2 className={postRelatedClassicHeroTitle}>
                  {posts[0].title || "Untitled"}
                </h2>
              </Link>
            )}
          </div>

          <div className="flex flex-col lg:w-[40%]">
            {posts
              .slice(1, RELATED_MODULE_CLASSIC_TOTAL)
              .map((post, index, arr) => (
                <div key={post._id}>
                  <Link
                    href={post.href}
                    className="block py-4 transition-opacity"
                  >
                    <h3 className={postRelatedClassicListTitle}>
                      {post.title || "Untitled"}
                    </h3>
                  </Link>
                  {index < arr.length - 1 && (
                    <div className="border-news-border border-b" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModernRelatedArticles({
  posts,
  categoryName,
  categoryHref,
}: {
  posts: ArticleSidebarPost[];
  categoryName?: string;
  categoryHref?: string;
}) {
  const gridPosts = posts.slice(0, 6);
  const sidePosts = posts.slice(6, RELATED_MODULE_MODERN_TOTAL);

  const trimmedCategory = categoryName?.trim();
  const sectionTitle = trimmedCategory
    ? `More in ${trimmedCategory}`
    : "More to read";

  return (
    <section
      className="mt-[88px] border-news-border border-t pt-[52px] pb-[72px]"
      aria-label="Related articles"
    >
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_300px] lg:gap-x-14">
        <div
          className={cn(
            "min-w-0",
            sidePosts.length > 0 &&
              "mb-10 border-news-border border-b pb-10 lg:mb-0 lg:border-r lg:border-b-0 lg:pr-14 lg:pb-0",
          )}
        >
          <div className="mb-[30px] flex items-baseline justify-between gap-4">
            <h2 className={postRelatedModernSectionTitle}>{sectionTitle}</h2>
            {trimmedCategory && categoryHref && (
              <Link
                href={categoryHref}
                className={postRelatedModernViewAllLink}
              >
                View all {trimmedCategory} →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post) => (
              <ModernGridCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        {sidePosts.length > 0 && (
          <aside className="min-w-0">
            <div
              className={cn(
                "mb-1 border-news-text border-b-2 pb-3.5",
                postRelatedModernRailEyebrow,
              )}
            >
              Top Stories
            </div>
            <div className="flex flex-col">
              {sidePosts.map((post, index) => (
                <ModernSideItem
                  key={post._id}
                  post={post}
                  isLast={index === sidePosts.length - 1}
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

function ModernSideItem({
  post,
  isLast,
}: {
  post: ArticleSidebarPost;
  isLast: boolean;
}) {
  return (
    <Link
      href={post.href}
      className={cn(
        "group block py-[18px]",
        !isLast && "border-news-border border-b",
      )}
    >
      <p className={cn(postRelatedModernRailDate, "mb-[7px]")}>
        {formatTopStoryTimestamp(post.date)}
      </p>
      <h3 className={postRelatedModernSideTitle}>{post.title || "Untitled"}</h3>
    </Link>
  );
}

function ModernGridCard({ post }: { post: ArticleSidebarPost }) {
  const coverData = getCoverImage(
    post.cover as Parameters<typeof getCoverImage>[0],
    post.title || "Article image",
    600,
  );
  const categoryLabel = post.category?.title?.trim();

  return (
    <Link href={post.href} className="group flex h-full min-w-0 flex-col">
      <div className="relative mb-3.5 h-[170px] w-full shrink-0 overflow-hidden bg-news-background">
        {coverData?.src ? (
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={600}
            height={340}
            fill
            quality={55}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={coverData.unoptimized}
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-news-surface">
            <span className="font-sans text-news-muted text-xs">No image</span>
          </div>
        )}
      </div>
      {categoryLabel && (
        <p className={cn(postRelatedModernCardCategory, "mb-[7px]")}>
          {categoryLabel}
        </p>
      )}
      <h3 className={cn(postRelatedModernCardTitle, "mb-2")}>
        {post.title || "Untitled"}
      </h3>
      <span className={postRelatedModernCardReadTime}>
        {post.readTime || 3} min read
      </span>
    </Link>
  );
}

function formatTopStoryTimestamp(value: string | undefined): string {
  if (!value) return "";

  let parsed: Date;
  try {
    parsed = parseISO(value);
  } catch {
    return "";
  }
  if (Number.isNaN(parsed.getTime())) return "";

  const diffMs = Date.now() - parsed.getTime();
  const oneHourMs = 60 * 60 * 1000;
  const oneDayMs = 24 * oneHourMs;

  if (diffMs >= 0 && diffMs < oneHourMs) {
    return formatDistanceToNowStrict(parsed, {
      addSuffix: true,
      unit: "minute",
    });
  }

  if (diffMs >= 0 && diffMs < oneDayMs) {
    return parsed
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
      .toUpperCase();
  }

  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

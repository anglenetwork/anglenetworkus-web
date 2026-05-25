import Link from "next/link";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";
import { ARTICLE_IMAGE_FRAME_CLASS } from "./PostBody/constants";

export type BottomArticleModuleVariant = "classic" | "modern";

/** Classic: 1 hero + up to 6 list items. Modern: 6 grid cards + 4 sidebar items. */
export const RELATED_MODULE_CLASSIC_TOTAL = 7;
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
          accentStyle="geometric-square"
          size="large"
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
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                        <span className="text-neutral-500">No Image</span>
                      </div>
                    );
                  })()}
                </div>
                <h2 className="mt-4 text-start font-sans font-semibold text-2xl text-neutral-900 leading-snug tracking-tight md:text-3xl">
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
                    <h3 className="mb-2 font-normal font-sans text-lg text-neutral-900 leading-normal tracking-normal">
                      {post.title || "Untitled"}
                    </h3>
                  </Link>
                  {index < arr.length - 1 && (
                    <div className="border-neutral-200 border-b" />
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

  return (
    <div className="my-8 sm:my-12">
      <section
        className={`w-full bg-black text-white ${ARTICLE_IMAGE_FRAME_CLASS}`}
        aria-label="Related articles"
      >
        <div className="mx-auto max-w-[1440px] px-8 py-10 sm:px-10 sm:py-12 md:px-12 lg:px-16 lg:py-16">
          <div className="flex flex-col gap-10 md:gap-12 lg:flex-row lg:gap-16">
            <div className="min-w-0 lg:flex-[2]">
              <h2 className="font-sans font-semibold text-sm text-white uppercase tracking-wide sm:text-base">
                {trimmedCategory ? (
                  <>
                    More in{" "}
                    {categoryHref ? (
                      <Link
                        href={categoryHref}
                        className="text-sectionAccent underline decoration-1 underline-offset-2 hover:opacity-90"
                      >
                        {trimmedCategory}
                      </Link>
                    ) : (
                      <span className="text-sectionAccent underline decoration-1 underline-offset-2">
                        {trimmedCategory}
                      </span>
                    )}
                  </>
                ) : (
                  "More to read"
                )}
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-8">
                {gridPosts.map((post) => (
                  <ModernGridCard key={post._id} post={post} />
                ))}
              </div>
            </div>

            {sidePosts.length > 0 && (
              <aside className="min-w-0 border-white/30 border-t pt-10 lg:max-w-[360px] lg:flex-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                <h2 className="font-sans font-semibold text-sectionAccent text-sm uppercase tracking-wide">
                  Top Stories
                </h2>

                <ul className="mt-6 divide-y divide-white/30">
                  {sidePosts.map((post) => (
                    <ModernSideItem key={post._id} post={post} />
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ModernSideItem({ post }: { post: ArticleSidebarPost }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <Link href={post.href} className="group block min-w-0">
        <p className="font-sans font-semibold text-[11px] text-sectionAccent uppercase tracking-wide">
          {formatTopStoryTimestamp(post.date)}
        </p>
        <h3 className="mt-2 break-words font-medium font-sans text-sm text-white leading-snug group-hover:underline sm:text-base">
          {post.title || "Untitled"}
        </h3>
      </Link>
    </li>
  );
}

function ModernGridCard({ post }: { post: ArticleSidebarPost }) {
  const coverData = getCoverImage(
    post.cover as Parameters<typeof getCoverImage>[0],
    post.title || "Article image",
    600,
  );

  return (
    <Link href={post.href} className="group flex h-full min-w-0 flex-col">
      <div
        className={`relative aspect-[4/3] w-full shrink-0 ${ARTICLE_IMAGE_FRAME_CLASS}`}
      >
        {coverData?.src ? (
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={600}
            height={450}
            fill
            quality={55}
            sizes="(max-width: 640px) calc(100vw - 4rem), (max-width: 1024px) 50vw, 33vw"
            unoptimized={coverData.unoptimized}
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-neutral-800">
            <span className="text-neutral-400 text-xs">No image</span>
          </div>
        )}
      </div>
      <h3 className="mt-3 break-words font-medium font-sans text-sm text-white leading-snug group-hover:underline sm:text-base">
        {post.title || "Untitled"}
      </h3>
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
    }).toUpperCase();
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

  return parsed
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

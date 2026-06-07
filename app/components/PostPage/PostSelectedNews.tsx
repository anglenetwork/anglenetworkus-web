import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";
import {
  postSidebarListTitle,
  postSidebarSectionTitle,
} from "@/app/lib/typography/post-page";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface PostSelectedNewsProps {
  latestNews: ArticleSidebarPost[];
  title: string;
}

export default function PostSelectedNews({
  latestNews,
  title,
}: PostSelectedNewsProps) {
  if (!latestNews || latestNews.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className={postSidebarSectionTitle}>{title}</h2>

      <div className="flex flex-col divide-y divide-dotted divide-neutral-300">
        {latestNews.slice(0, 4).map((post: ArticleSidebarPost, index) => {
          const coverData = getCoverImage(
            post.cover as Parameters<typeof getCoverImage>[0],
            post.title || "Article image",
            200,
          );
          const imgUrl = coverData?.src ?? null;

          return (
            <article
              key={post._id}
              className={cn(
                "py-4",
                index === 0 && "pt-0",
                index === Math.min(latestNews.length, 4) - 1 && "pb-0",
              )}
            >
              <Link
                href={post.href}
                className="group flex items-start gap-3"
                aria-label={`Read article: ${post.title}`}
              >
                <div className="min-w-0 flex-1">
                  <h3 className={postSidebarListTitle}>{post.title}</h3>
                  <ReadTimeLabel minutes={post.readTime} />
                </div>
                {imgUrl ? (
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-neutral-950">
                    <ImageRenderer
                      src={imgUrl}
                      alt={coverData?.alt || post.title || "Article image"}
                      unoptimized={coverData?.unoptimized}
                      className="object-cover object-center"
                      width={112}
                      height={80}
                      quality={50}
                      sizes="112px"
                      fill
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-sm bg-neutral-200 font-sans text-[10px] text-neutral-500">
                    No Image
                  </div>
                )}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

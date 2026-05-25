import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";

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
    <div className="mx-auto w-full max-w-md rounded-lg bg-white">
      {/* Header */}
      <h2 className="mb-6 font-bold font-sans text-foreground text-xl">
        {title}
      </h2>

      {/* Articles List */}
      <div className="space-y-4">
        {latestNews.slice(0, 4).map((post: ArticleSidebarPost) => {
          // Use smaller thumbnail (200px) for sidebar images to reduce file size
          const coverData = getCoverImage(
            post.cover as Parameters<typeof getCoverImage>[0],
            post.title || "Article image",
            200,
          );
          const imgUrl = coverData?.src ?? null;

          return (
            <article key={post._id} className="group">
              <Link
                href={post.href}
                className="flex cursor-pointer items-start gap-4 rounded-lg transition-colors duration-200"
              >
                {/* Article Image */}
                <div className="flex-shrink-0">
                  {imgUrl ? (
                    <div className="relative h-[77px] w-24 overflow-hidden rounded-lg">
                      <ImageRenderer
                        src={imgUrl}
                        alt={coverData?.alt || post.title || "Article image"}
                        unoptimized={coverData?.unoptimized}
                        className="object-cover object-center transition-opacity duration-200"
                        width={96}
                        height={77}
                        quality={50}
                        sizes="96px"
                        fill
                        // Lazy load sidebar images (below the fold)
                      />
                    </div>
                  ) : (
                    <div className="flex h-[77px] w-24 items-center justify-center rounded-lg bg-gray-200/80 font-sans text-[10px] text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 font-sans font-semibold text-[15px] text-neutral-900 leading-snug tracking-normal">
                    {post.title}
                  </h3>
                  {post.date && (
                    <p className="mt-1 font-sans text-neutral-500 text-xs">
                      {(() => {
                        try {
                          return format(parseISO(post.date), "MMM dd, h:mm a");
                        } catch {
                          return "";
                        }
                      })()}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

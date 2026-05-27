import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { tagSidebarTrendingTitle } from "@/app/lib/typography/tag-page";

interface Post {
  _id: string;
  title: string | null;
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
  views7d?: number | null;
  readTime?: number | null;
}

interface Tag {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  emoji?: string;
  color?: string;
  featured?: boolean;
}

interface TagSidebarProps {
  popularReads: Post[];
  tag: Tag;
}

export default function TagSidebar({ popularReads, tag }: TagSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Trending in this tag */}
      {popularReads.length > 0 && (
        <div>
          <h3 className="mb-4 font-semibold text-gray-900 text-lg">
            Trending in {tag.title}
          </h3>
          <div className="space-y-4">
            {popularReads.slice(0, 4).map((post, index) => (
              <Link
                key={post._id}
                href={`/post/${post.slug}`}
                className="group block"
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                    {(() => {
                      const coverData = getCoverImage(
                        post.cover,
                        post.title || "Post image",
                      );
                      if (coverData?.src) {
                        return (
                          <ImageRenderer
                            src={coverData.src}
                            alt={coverData.alt}
                            width={64}
                            height={64}
                            fill
                            sizes="64px"
                            unoptimized={coverData.unoptimized}
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        );
                      }
                      return (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={tagSidebarTrendingTitle}>{post.title}</h4>
                    <div className="mt-1 flex items-center gap-2 text-gray-500 text-xs">
                      {post.author && <span>{post.author.name}</span>}
                      {post.views7d && post.views7d > 0 && (
                        <>
                          <span>•</span>
                          <span>{post.views7d} views</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tag info */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-900 text-lg">
          About {tag.title}
        </h3>
        {tag.description ? (
          <p className="text-gray-600 text-sm leading-relaxed">
            {tag.description}
          </p>
        ) : (
          <p className="text-gray-600 text-sm">
            Explore all posts tagged with <strong>{tag.title}</strong>.
          </p>
        )}

        {tag.featured && (
          <div className="mt-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">
              Featured Tag
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

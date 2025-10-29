import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string | null;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trending in {tag.title}
          </h3>
          <div className="space-y-4">
            {popularReads.slice(0, 4).map((post, index) => (
              <Link
                key={post._id}
                href={`/post/${post.slug}`}
                className="block group"
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                    <Image
                      src={
                        post.coverImage
                          ? urlForImage(post.coverImage)?.url() ||
                            "/placeholder.svg"
                          : "/placeholder.svg"
                      }
                      alt={post.title || "Post image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
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
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          About {tag.title}
        </h3>
        {tag.description ? (
          <p className="text-sm text-gray-600 leading-relaxed">
            {tag.description}
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Explore all posts tagged with <strong>{tag.title}</strong>.
          </p>
        )}

        {tag.featured && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Featured Tag
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

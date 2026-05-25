import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageRenderer } from "@/app/components/ui/image-renderer";

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

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface TagPostsListProps {
  posts: Post[];
  tagSlug: string;
  pagination: Pagination;
}

export default function TagPostsList({
  posts,
  tagSlug,
  pagination,
}: TagPostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-gray-400">📝</div>
        <h3 className="mb-2 font-semibold text-gray-900 text-xl">
          No posts yet
        </h3>
        <p className="text-gray-600">
          There are no posts tagged with this topic yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-xl">
          Posts tagged with &ldquo;{tagSlug}&rdquo;
        </h2>
        <span className="text-gray-500 text-sm">
          {pagination.totalPosts}{" "}
          {pagination.totalPosts === 1 ? "post" : "posts"}
        </span>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post._id}
            className="overflow-hidden rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-lg"
          >
            <div className="md:flex">
              {/* Image */}
              <div className="relative h-48 md:h-auto md:w-1/3">
                <Link href={`/post/${post.slug}`} className="block h-full">
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
                          width={600}
                          height={400}
                          fill
                          unoptimized={coverData.unoptimized}
                          className="object-cover"
                        />
                      );
                    }
                    return (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    );
                  })()}
                </Link>
              </div>

              {/* Content */}
              <div className="p-6 md:w-2/3">
                <div className="mb-2 flex items-center gap-2">
                  {post.category && (
                    <Link
                      href={`/category/${post.category.slug}`}
                      className="font-medium text-blue-600 text-xs uppercase tracking-wider hover:text-blue-800"
                    >
                      {post.category.title}
                    </Link>
                  )}
                  <span className="text-gray-300">•</span>
                  <time className="text-gray-500 text-xs">
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                </div>

                <Link href={`/post/${post.slug}`} className="block">
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl transition-colors hover:text-blue-600">
                    {post.title}
                  </h3>
                </Link>

                {post.excerpt && (
                  <p className="mb-4 line-clamp-2 text-gray-600">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    {post.author && <span>By {post.author.name}</span>}
                    {post.readTime && <span>{post.readTime} min read</span>}
                    {post.views7d && post.views7d > 0 && (
                      <span>{post.views7d} views</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="text-gray-500 text-sm">
            Showing {(pagination.currentPage - 1) * 20 + 1} to{" "}
            {Math.min(pagination.currentPage * 20, pagination.totalPosts)} of{" "}
            {pagination.totalPosts} posts
          </div>

          <div className="flex items-center gap-2">
            {pagination.hasPrevPage && (
              <Link href={`/tag/${tagSlug}?page=${pagination.currentPage - 1}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
              </Link>
            )}

            <span className="px-3 text-gray-500 text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            {pagination.hasNextPage && (
              <Link href={`/tag/${tagSlug}?page=${pagination.currentPage + 1}`}>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

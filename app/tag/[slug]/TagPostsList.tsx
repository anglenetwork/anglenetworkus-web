import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Posts tagged with "{tagSlug}"
        </h2>
        <span className="text-sm text-gray-500">
          {pagination.totalPosts}{" "}
          {pagination.totalPosts === 1 ? "post" : "posts"}
        </span>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <Link href={`/post/${post.slug}`} className="block h-full">
                  <Image
                    src={
                      post.coverImage
                        ? urlForImage(post.coverImage)?.url() ||
                          "/placeholder.svg"
                        : "/placeholder.svg"
                    }
                    alt={post.title || "Post image"}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-2">
                  {post.category && (
                    <Link
                      href={`/category/${post.category.slug}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                    >
                      {post.category.title}
                    </Link>
                  )}
                  <span className="text-gray-300">•</span>
                  <time className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                </div>

                <Link href={`/post/${post.slug}`} className="block">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
          <div className="text-sm text-gray-500">
            Showing {(pagination.currentPage - 1) * 20 + 1} to{" "}
            {Math.min(pagination.currentPage * 20, pagination.totalPosts)} of{" "}
            {pagination.totalPosts} posts
          </div>

          <div className="flex items-center gap-2">
            {pagination.hasPrevPage && (
              <Link href={`/tag/${tagSlug}?page=${pagination.currentPage - 1}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </Link>
            )}

            <span className="text-sm text-gray-500 px-3">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            {pagination.hasNextPage && (
              <Link href={`/tag/${tagSlug}?page=${pagination.currentPage + 1}`}>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

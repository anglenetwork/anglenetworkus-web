import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import { categorySidebarStoryTitle } from "@/app/lib/typography/category-page";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  href?: string;
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
}

interface CategorySidebarProps {
  posts: Post[];
  categoryName: string;
}

export default function CategorySidebar({
  posts,
  categoryName,
}: CategorySidebarProps) {
  // Helper function to get image data from cover
  const getImageData = (cover: any, fallbackTitle: string = "Article") => {
    const coverData = getCoverImage(cover, fallbackTitle);
    return coverData
      ? {
          src: coverData.src,
          alt: coverData.alt,
          unoptimized: coverData.unoptimized,
        }
      : {
          src: "/placeholder.svg",
          alt: fallbackTitle,
          unoptimized: false,
        };
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get most recent posts for sidebar
  const recentPosts = posts.slice(0, 5);
  // Get trending posts (you can implement your own logic here)
  const trendingPosts = posts.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Recent Articles */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 font-bold text-gray-900 text-lg">
          Recent in {categoryName}
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <div key={post._id} className="flex gap-3">
              <div className="flex-shrink-0">
                <Link href={post.href ?? `/post/${post.slug || "#"}`}>
                  {(() => {
                    const imageData = getImageData(
                      post.cover,
                      post.title || "Article image",
                    );
                    return (
                      <ImageRenderer
                        src={imageData.src}
                        alt={imageData.alt}
                        width={80}
                        height={60}
                        sizes="80px"
                        unoptimized={imageData.unoptimized}
                        className="h-15 w-20 cursor-pointer rounded object-cover transition-opacity hover:opacity-90"
                      />
                    );
                  })()}
                </Link>
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-gray-500 text-xs">
                  {formatDate(post.date)}
                </div>
                <Link href={post.href ?? `/post/${post.slug || "#"}`}>
                  <h4 className={categorySidebarStoryTitle}>
                    {post.title || "Untitled"}
                  </h4>
                </Link>
                <div className="mt-1 text-gray-500 text-xs">
                  {post.author?.name || "Anonymous"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Articles */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 font-bold text-gray-900 text-lg">
          Trending in {categoryName}
        </h3>
        <div className="space-y-4">
          {trendingPosts.map((post, index) => (
            <div key={post._id} className="flex items-start gap-3">
              <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={post.href ?? `/post/${post.slug || "#"}`}>
                  <h4 className={categorySidebarStoryTitle}>
                    {post.title || "Untitled"}
                  </h4>
                </Link>
                <div className="mt-1 text-gray-500 text-xs">
                  {post.author?.name || "Anonymous"} • {formatDate(post.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Info */}
      <div className="rounded-lg bg-blue-50 p-6">
        <h3 className="mb-3 font-bold text-gray-900 text-lg">
          About {categoryName}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Stay updated with the latest news and insights in the {categoryName}{" "}
          category. Our team brings you comprehensive coverage and analysis of
          the most important stories.
        </p>
        <div className="mt-4 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Articles:</span>
            <span className="font-semibold text-blue-600">{posts.length}</span>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-lg bg-gray-900 p-6 text-white">
        <h3 className="mb-3 font-bold text-lg">Stay Updated</h3>
        <p className="mb-4 text-gray-300 text-sm">
          Get the latest {categoryName} news delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address for newsletter"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

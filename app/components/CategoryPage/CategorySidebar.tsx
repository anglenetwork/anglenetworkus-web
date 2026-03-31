import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";

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
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
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
                      post.title || "Article image"
                    );
                    return (
                      <ImageRenderer
                        src={imageData.src}
                        alt={imageData.alt}
                        width={80}
                        height={60}
                        unoptimized={imageData.unoptimized}
                        className="w-20 h-15 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded"
                      />
                    );
                  })()}
                </Link>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-1">
                  {formatDate(post.date)}
                </div>
                <Link href={post.href ?? `/post/${post.slug || "#"}`}>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title || "Untitled"}
                  </h4>
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  {post.author?.name || "Anonymous"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Articles */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Trending in {categoryName}
        </h3>
        <div className="space-y-4">
          {trendingPosts.map((post, index) => (
            <div key={post._id} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={post.href ?? `/post/${post.slug || "#"}`}>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title || "Untitled"}
                  </h4>
                </Link>
                <div className="text-xs text-gray-500 mt-1">
                  {post.author?.name || "Anonymous"} • {formatDate(post.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Info */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          About {categoryName}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
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
      <div className="bg-gray-900 rounded-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
        <p className="text-sm text-gray-300 mb-4">
          Get the latest {categoryName} news delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

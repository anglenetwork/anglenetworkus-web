import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
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
  };
  category?: {
    title: string;
    slug: string;
  };
}

interface PostSelectedNewsAltProps {
  latestNews: Post[];
  title: string;
}

export default function PostSelectedNewsAlt({
  latestNews,
  title,
}: PostSelectedNewsAltProps) {
  if (!latestNews || latestNews.length === 0) {
    return null;
  }

  // Get posts 4-6 for the third column, but ensure we have enough posts
  const thirdColumnPosts = latestNews.length >= 4 ? latestNews.slice(3, 6) : [];

  if (thirdColumnPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-lg p-6 shadow-sm bg-neutral-100">
      {/* Header */}
      <h2 className="text-xl font-secondary font-bold text-foreground mb-6">
        {title}
      </h2>

      {/* Articles List */}
      <div className="space-y-4">
        {thirdColumnPosts.map((post, index) => (
          <Link
            key={post._id}
            href={`/post/${post.slug}`}
            className="group flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
          >
            {/* Article Image */}
            <div className="flex-shrink-0">
              {(() => {
                const coverData = getCoverImage(post.cover, post.title || "Article image");
                if (coverData?.src) {
                  return (
                    <Image
                      src={coverData.src}
                      alt={coverData.alt}
                      width={80}
                      height={64}
                      quality={60}
                      sizes="80px"
                      unoptimized={coverData.unoptimized}
                      className="w-20 h-16 object-cover rounded-md border border-border group-hover:border-primary/30 transition-colors duration-200"
                    />
                  );
                }
                return (
                  <div className="w-20 h-16 bg-gray-200 rounded-md border border-border flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                );
              })()}
            </div>

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-secondary text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

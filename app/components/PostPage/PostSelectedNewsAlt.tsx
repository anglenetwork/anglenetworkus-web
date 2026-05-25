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
    <div className="mx-auto w-full max-w-md rounded-lg bg-card bg-neutral-100 p-6 shadow-sm">
      {/* Header */}
      <h2 className="mb-6 font-bold font-sans text-foreground text-xl">
        {title}
      </h2>

      {/* Articles List */}
      <div className="space-y-4">
        {thirdColumnPosts.map((post, index) => (
          <Link
            key={post._id}
            href={`/post/${post.slug}`}
            className="group flex cursor-pointer items-start gap-4 rounded-lg p-2 transition-colors duration-200 hover:bg-muted/50"
          >
            {/* Article Image */}
            <div className="flex-shrink-0">
              {(() => {
                const coverData = getCoverImage(
                  post.cover,
                  post.title || "Article image",
                );
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
                      className="h-16 w-20 rounded-md object-cover transition-opacity duration-200 group-hover:opacity-90"
                    />
                  );
                }
                return (
                  <div className="flex h-16 w-20 items-center justify-center rounded-md bg-gray-200/80">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                );
              })()}
            </div>

            {/* Article Content */}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 font-sans font-semibold text-foreground text-sm leading-tight transition-colors duration-200 group-hover:text-primary">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

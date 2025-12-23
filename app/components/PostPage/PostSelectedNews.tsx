import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";

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
    epigraph?: string | null;
    imageSource?: string | null;
  } | null;
  date?: string; // normalized in queries (coalesce(publishedAt, date))
  author?: {
    name: string;
    picture?: any;
  };
  category?: {
    title: string;
    slug: string;
  };
}

interface PostSelectedNewsProps {
  latestNews: Post[];
  title: string;
}

export default function PostSelectedNews({
  latestNews,
  title,
}: PostSelectedNewsProps) {
  if (!latestNews || latestNews.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg">
      {/* Header */}
      <h2 className="text-xl font-secondary font-bold text-foreground mb-6">
        {title}
      </h2>

      {/* Articles List */}
      <div className="space-y-4">
        {latestNews.slice(0, 4).map((post) => {
          const coverData = getCoverImage(
            post.cover,
            post.title || "Article image"
          );
          const imgUrl = coverData?.src ?? null;

          return (
            <article key={post._id} className="group">
              <Link
                href={`/post/${post.slug}`}
                className="flex items-start gap-4 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                {/* Article Image */}
                <div className="flex-shrink-0">
                  {imgUrl ? (
                    <div className="relative w-24 h-[77px] overflow-hidden rounded-lg">
                      <ImageRenderer
                        src={imgUrl}
                        alt={coverData?.alt || post.title || "Article image"}
                        unoptimized={coverData?.unoptimized}
                        className="w-full h-full object-cover transition-opacity duration-200"
                        width={96}
                        height={77}
                        quality={60}
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-[77px] rounded-lg bg-gray-200/80 flex items-center justify-center text-[10px] text-gray-500 font-secondary">
                      No Image
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-secondary font-semibold text-neutral-900 leading-snug tracking-normal mb-2">
                    {post.title}
                  </h3>
                  {post.date && (
                    <p className="text-xs text-neutral-500 mt-1 font-secondary">
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

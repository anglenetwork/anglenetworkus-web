import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: any;
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
      <h2 className="text-xl font-inter font-bold text-foreground mb-6">
        {title}
      </h2>

      {/* Articles List */}
      <div className="space-y-4">
        {latestNews.slice(0, 4).map((post, index) => {
          const imgBuilder = post.coverImage
            ? urlForImage(post.coverImage)
            : undefined;
          const imgUrl =
            imgBuilder?.width(192).height(154).fit("crop").url() ?? null;

          return (
            <Link
              key={post._id}
              href={`/post/${post.slug}`}
              className="group flex items-start gap-4 rounded-lg  transition-colors duration-200 cursor-pointer"
            >
              {/* Article Image */}
              <div className="flex-shrink-0">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={post.title || "Article image"}
                    width={96}
                    height={77}
                    className="w-24 h-[77px] object-cover rounded-md  transition-opacity duration-200"
                    quality={95}
                    priority={index === 0}
                  />
                ) : (
                  <div className="w-24 h-[77px] rounded-md bg-gray-200/80 flex items-center justify-center text-[10px] text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-inter text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-inter">
                  {format(parseISO(post.date), "MMM dd, h:mm a")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

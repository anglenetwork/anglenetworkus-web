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

interface BottomArticleModuleProps {
  posts: Post[];
}

export default function BottomArticleModule({
  posts,
}: BottomArticleModuleProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="">
      <div className="py-12 px-0">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <h2 className="text-sm uppercase font-medium text-neutral-900 tracking-wide font-sans">
              Related Articles
            </h2>
          </div>
          <div className="border-t border-black mb-6"></div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-[60%]">
            {posts[0] && (
              <Link
                href={`/post/${posts[0].slug || "#"}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  {posts[0].coverImage ? (
                    <Image
                      src={
                        urlForImage(posts[0].coverImage)
                          ?.width(800)
                          .height(500)
                          .url() || ""
                      }
                      alt={posts[0].title || "Article image"}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                      <span className="text-neutral-500">No Image</span>
                    </div>
                  )}
                </div>
                <h2 className="mt-6 text-3xl font-medium leading-tight text-neutral-900 font-sans">
                  {posts[0].title || "Untitled"}
                </h2>
              </Link>
            )}
          </div>

          <div className="flex flex-col lg:w-[40%]">
            {posts.slice(1).map((post, index) => (
              <div key={post._id}>
                <Link
                  href={`/post/${post.slug || "#"}`}
                  className="block py-4 transition-opacity"
                >
                  <h3 className="text-base font-regular leading-relaxed text-neutral-900 font-sans">
                    {post.title || "Untitled"}
                  </h3>
                </Link>
                {index < posts.slice(1).length - 1 && (
                  <div className="border-b border-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string;
  coverImage?: any;
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface RightColumnLandingProps {
  sideStories: Post[];
  mostRead: Post[];
}

export function RightColumnLanding({
  sideStories,
  mostRead,
}: RightColumnLandingProps) {
  return (
    <div className="text-left px-0 md:px-4">
      {sideStories.map((post, index) => (
        <article key={post._id} className="mb-4">
          {post.coverImage &&
            (() => {
              const imageUrl = urlForImage(post.coverImage);
              if (!imageUrl) return null;
              return (
                <Link href={`/post/${post.slug}`}>
                  <div className="mb-4">
                    <Image
                      src={imageUrl.url()}
                      alt={post.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                </Link>
              );
            })()}
          <Link href={`/post/${post.slug}`} className="hover:text-red-600">
            <h3 className="text-xl font-sans font-medium text-neutral-900 leading-tight">
              {post.title}
            </h3>
          </Link>
          {index < sideStories.length - 1 && (
            <div className="border-b border-gray-300 mt-4"></div>
          )}
        </article>
      ))}

      {/* MOST READ section */}
      <div className="border-t border-neutral-300 pt-4">
        <div className="flex items-center justify-start mb-4">
          <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
            Most Read
          </h2>
        </div>

        <div className="border-b border-gray-300 mb-6"></div>

        <div className="space-y-6">
          {/* Featured image */}
          {mostRead[0]?.coverImage &&
            (() => {
              const imageUrl = urlForImage(mostRead[0].coverImage);
              if (!imageUrl) return null;
              return (
                <Link href={`/post/${mostRead[0].slug}`}>
                  <div className="mb-6">
                    <Image
                      src={imageUrl.url()}
                      alt={mostRead[0].title}
                      width={400}
                      height={256}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                </Link>
              );
            })()}

          {/* Numbered list of most read articles */}
          <div className="space-y-4">
            {mostRead.map((post, index) => (
              <article
                key={post._id}
                className={`flex items-start justify-center lg:justify-start space-x-3 ${index < mostRead.length - 1 ? "border-b border-gray-200" : ""} pb-4`}
              >
                <span className="text-lg font-bold text-red-600 flex-shrink-0 font-sans">
                  {index + 1}
                </span>
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-base font-sans font-medium text-neutral-900 leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getCoverImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
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
          {(() => {
            const coverData = getCoverImage(post.cover, post.title);
            if (!coverData) return null;
            return (
              <Link href={`/post/${post.slug}`}>
                <div className="mb-4">
                  <Image
                    src={coverData.src}
                    alt={coverData.alt}
                    width={400}
                    height={192}
                    unoptimized={coverData.unoptimized}
                    className="w-full h-48 object-cover rounded-sm"
                  />
                </div>
              </Link>
            );
          })()}
          <Link href={`/post/${post.slug}`} className="hover:text-red-600">
            <h3 className="text-xl font-sans font-medium text-neutral-900 leading-normal tracking-wide">
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
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
          <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
            Most Read
          </h2>
        </div>

        <div className="border-b border-gray-300 mb-6"></div>

        <div className="space-y-6">
          {/* Featured image */}
          {(() => {
            const coverData = getCoverImage(
              mostRead[0]?.cover,
              mostRead[0]?.title || "Article"
            );
            if (!coverData) return null;
            return (
              <Link href={`/post/${mostRead[0].slug}`}>
                <div className="mb-6">
                  <Image
                    src={coverData.src}
                    alt={coverData.alt}
                    width={400}
                    height={256}
                    unoptimized={coverData.unoptimized}
                    className="w-full h-48 object-cover rounded-sm"
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
                <span className="text-lg font-bold text-blue-600 flex-shrink-0 font-sans">
                  {index + 1}
                </span>
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-neutral-900 leading-snug font-sans text-base line-clamp-2 font-medium tracking-wide">
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

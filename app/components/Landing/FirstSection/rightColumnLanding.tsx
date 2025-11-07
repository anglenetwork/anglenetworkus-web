import Link from "next/link";
import Image from "next/image";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";

interface Post {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    imageSource?: string | null;
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
                <div className="mb-4 relative">
                  <Image
                    src={coverData.src}
                    alt={coverData.alt}
                    width={600}
                    height={400}
                    unoptimized={coverData.unoptimized}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-48 object-cover rounded-sm"
                  />
                  {post.cover?.imageSource && (
                    <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                      {post.cover.imageSource}
                    </div>
                  )}
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
      <div className="border-t border-neutral-300 pt-8">
        <SectionHeader title="The Rundown" variant="gradient" />

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
                <div className="mb-6 relative">
                  <Image
                    src={coverData.src}
                    alt={coverData.alt}
                    width={600}
                    height={400}
                    unoptimized={coverData.unoptimized}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-48 object-cover rounded-sm"
                  />
                  {mostRead[0]?.cover?.imageSource && (
                    <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                      {mostRead[0].cover.imageSource}
                    </div>
                  )}
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
                  <h3 className="text-neutral-900 leading-snug font-sans text-base font-normal tracking-wide">
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

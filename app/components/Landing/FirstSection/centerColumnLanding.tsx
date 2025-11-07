import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { PlayCircle } from "lucide-react";
import { SectionHeader } from "../../ui/section-header";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string;
    image?: any;
    alt?: string;
    imageSource?: string;
  };
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface CenterColumnLandingProps {
  mainStory: Post[];
  relatedCategoryPosts: Post[];
  moreTopHeadlines: Post[];
}

export function CenterColumnLanding({
  mainStory,
  relatedCategoryPosts,
  moreTopHeadlines,
}: CenterColumnLandingProps) {
  const getCover = (
    post: Post
  ): {
    src: string | null;
    alt: string;
    unoptimized: boolean;
    imageSource?: string;
  } => {
    // 1) External URL
    if (post.cover?.source === "external" && post.cover?.externalUrl) {
      return {
        src: post.cover.externalUrl,
        alt: post.cover.alt || post.title,
        unoptimized: true, // unless domain is whitelisted in next.config
        imageSource: post.cover.imageSource,
      };
    }
    // 2) New asset image
    if (post.cover?.source === "asset" && post.cover?.image) {
      const b = urlForImage(post.cover.image);
      if (b) {
        return {
          src: b.quality(85).url(),
          alt: post.cover.alt || post.cover.image?.alt || post.title,
          unoptimized: false,
          imageSource: post.cover.imageSource,
        };
      }
    }
    return { src: null, alt: post.title, unoptimized: false };
  };

  return (
    <div className="lg:border-r border-gray-300 lg:px-8">
      <SectionHeader title="Top News" variant="gradient" />

      {/* Main Story */}
      {mainStory.map((post, index) => (
        <article key={post._id} className="mb-8">
          <Link href={`/post/${post.slug}`} className="hover:text-red-600">
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-4 font-sans text-start md:text-center">
              {post.title}
            </h1>
          </Link>

          {(() => {
            const { src, alt, unoptimized, imageSource } = getCover(post);
            if (!src) return null;
            return (
              <Link href={`/post/${post.slug}`}>
                <div className="mb-8 relative">
                  <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={675}
                    unoptimized={unoptimized}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="w-full h-80 md:h-[500px] object-cover rounded-sm"
                  />
                  {imageSource && (
                    <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                      {imageSource}
                    </div>
                  )}
                </div>
              </Link>
            );
          })()}
        </article>
      ))}

      {/* Related Category Posts */}
      {relatedCategoryPosts.length > 0 && (
        <main className="bg-white mb-4">
          <div className="mx-auto max-w-5xl px-0 py-2">
            {relatedCategoryPosts.map((post, index) => (
              <article
                key={post._id}
                className={`border-t border-gray-200 py-4 font-sans`}
              >
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600 block"
                >
                  <h2 className="text-lg font-normal leading-tight text-balance">
                    {post.title}
                  </h2>
                </Link>
              </article>
            ))}
          </div>
        </main>
      )}

      <SectionHeader title="More Top Headlines" variant="gradient" />

      {/* MORE TOP HEADLINES */}
      {/* Mobile spacing normalized; desktop untouched */}
      <div className="space-y-6 md:space-y-8 mb-8 md:mb-0">
        {/* First row: 2 main stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {moreTopHeadlines.slice(0, 2).map((post) => (
            <article key={post._id} className="flex gap-4 md:block">
              {(() => {
                const { src, alt, unoptimized, imageSource } = getCover(post);
                if (!src) return null;
                return (
                  <Link href={`/post/${post.slug}`}>
                    <div className="flex-shrink-0 mb-0 md:mb-4 relative">
                      <Image
                        src={src}
                        alt={alt}
                        width={600}
                        height={400}
                        unoptimized={unoptimized}
                        sizes="(max-width: 768px) 96px, (max-width: 1200px) 50vw, 600px"
                        className="w-24 h-20 md:w-full md:h-48 object-cover rounded-sm"
                      />
                      {imageSource && (
                        <div className="hidden md:block absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                          {imageSource}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })()}
              <div className="flex-1 md:block">
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-sm md:text-xl font-sans font-medium text-neutral-900 tracking-wide leading-normal mb-2">
                    {post.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Second row: 3 smaller stories (mobile layout unified with first row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {moreTopHeadlines.slice(2, 5).map((post) => (
            <article key={post._id} className="flex gap-4 md:block">
              {(() => {
                const { src, alt, unoptimized, imageSource } = getCover(post);
                if (!src) return null;
                return (
                  <Link href={`/post/${post.slug}`}>
                    <div className="flex-shrink-0 mb-0 md:mb-3 relative">
                      <Image
                        src={src}
                        alt={alt}
                        width={400}
                        height={300}
                        unoptimized={unoptimized}
                        sizes="(max-width: 768px) 96px, (max-width: 1200px) 33vw, 400px"
                        className="w-24 h-20 md:w-full md:h-32 object-cover rounded-sm"
                      />
                      {imageSource && (
                        <div className="hidden md:block absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                          {imageSource}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })()}
              <div className="flex-1 md:block">
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-sm md:text-base font-sans font-medium text-neutral-900 tracking-wide leading-normal mb-2">
                    {post.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getCoverImage, formatImageCredit } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

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
    creditProvider?: string | null;
    creditAuthor?: string | null;
    creditSourceUrl?: string | null;
    creditLicense?: string | null;
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
    post: Post,
  ): {
    src: string | null;
    alt: string;
    unoptimized: boolean;
    credit?: string | null;
  } => {
    const coverData = getCoverImage(post.cover, post.title);
    if (!coverData) {
      return { src: null, alt: post.title, unoptimized: false };
    }

    return {
      src: coverData.src,
      alt: coverData.alt,
      unoptimized: coverData.unoptimized,
      credit: post.cover ? formatImageCredit(post.cover) : null,
    };
  };

  return (
    <div className="lg:px-6">
      {/* <SectionHeader title="Top News" variant="light" accentStyle="geometric-square" size="large" /> */}

      {/* Main Story */}
      {mainStory.map((post, index) => (
        <article key={post._id} className="mb-8">
          <Link href={`/post/${post.slug}`} className="hover:text-red-600">
            <h1 className="text-3xl md:text-3xl lg:hidden font-bold text-gray-900 !leading-tight tracking-tight mb-4 font-sans text-start md:text-center">
              {post.title}
            </h1>
          </Link>

          {(() => {
            const { src, alt, unoptimized, credit } = getCover(post);
            if (!src) return null;
            return (
              <Link href={`/post/${post.slug}`}>
                <div className="mb-8">
                  <div className="w-full h-64 md:h-[500px] overflow-hidden rounded-sm relative">
                    <ImageRenderer
                      src={src}
                      alt={alt}
                      width={1000}
                      height={563} // 1000 / 16 * 9 ≈ 562.5
                      unoptimized={unoptimized}
                      quality={70}
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1280px) 60vw, 800px"
                      className="object-cover object-center rounded-sm"
                      fill
                    />
                    {post.excerpt && (
                      <div className="absolute bottom-2 left-0 right-0 bg-white rounded-sm p-4 m-4">
                        <p className="text-black text-sm md:text-lg font-sans font-semibold leading-snug line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })()}
        </article>
      ))}

      {/* MORE TOP HEADLINES */}
      {/* Mobile spacing normalized; desktop untouched */}
      <div className="space-y-6 md:space-y-8 mb-8 md:mb-0">
        {/* Section heading for proper hierarchy (h2 after h1) */}
        <h2 className="sr-only">More Top Headlines</h2>
        {/* First row: 2 main stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {moreTopHeadlines.slice(0, 2).map((post) => (
            <article key={post._id} className="md:block">
              {(() => {
                const { src, alt, unoptimized, credit } = getCover(post);
                if (!src) return null;
                return (
                  <Link href={`/post/${post.slug}`}>
                    <div className="mb-2">
                      <div className="w-full h-[200px] overflow-hidden rounded-sm relative">
                        <ImageRenderer
                          src={src}
                          alt={alt}
                          width={600}
                          height={500}
                          unoptimized={unoptimized}
                          quality={55}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                          className="object-cover rounded-sm"
                          fill
                        />
                      </div>
                      {/* {credit && (
                        <p className="hidden md:block text-[10px] text-gray-500 font-sans text-right">
                          {credit}
                        </p>
                      )} */}
                    </div>
                  </Link>
                );
              })()}
              <div>
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-base md:text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
                    {post.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Third story */}
        {moreTopHeadlines[2] && (
          <article>
            {(() => {
              const post = moreTopHeadlines[2];
              const { src, alt, unoptimized } = getCover(post);
              if (!src) return null;
              return (
                <Link href={`/post/${post.slug}`}>
                  <div className="mb-2">
                    <div className="w-full h-[200px] overflow-hidden rounded-sm relative">
                      <ImageRenderer
                        src={src}
                        alt={alt}
                        width={600}
                        height={400}
                        unoptimized={unoptimized}
                        quality={55}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                        className="object-cover rounded-sm"
                        fill
                      />
                    </div>
                  </div>
                </Link>
              );
            })()}
            <div>
              <Link
                href={`/post/${moreTopHeadlines[2].slug}`}
                className="hover:text-red-600"
              >
                <h3 className="text-base md:text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight">
                  {moreTopHeadlines[2].title}
                </h3>
              </Link>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

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
            <h1 className="text-2xl md:text-3xl lg:hidden font-bold text-gray-900 !leading-tight tracking-tight mb-4 font-sans text-start md:text-center">
              {post.title}
            </h1>
          </Link>

          {(() => {
            const { src, alt, unoptimized, credit } = getCover(post);
            if (!src) return null;
            return (
              <Link href={`/post/${post.slug}`}>
                <div className="mb-8">
                  <div className="relative w-full aspect-[5/6] overflow-hidden rounded-sm md:aspect-auto md:h-[500px]">
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
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-12 md:px-6 md:pb-6 md:pt-16">
                        <p className="line-clamp-4 font-sans text-base font-medium leading-relaxed text-white md:text-lg">
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
      <div className="mb-8 space-y-4 md:mb-0 md:space-y-8">
        <h2 className="sr-only">More Top Headlines</h2>

        {/* Mobile: 3 stacked rows — thumbnail left, title right */}
        <div className="flex flex-col gap-5 md:hidden">
          {moreTopHeadlines.slice(0, 3).map((post) => {
            const { src, alt, unoptimized } = getCover(post);
            return (
              <article key={post._id}>
                <Link
                  href={`/post/${post.slug}`}
                  className="group flex items-start gap-3 hover:text-red-600"
                >
                  {src ? (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm">
                      <ImageRenderer
                        src={src}
                        alt={alt}
                        width={96}
                        height={64}
                        unoptimized={unoptimized}
                        quality={55}
                        sizes="96px"
                        className="object-cover"
                        fill
                      />
                    </div>
                  ) : (
                    <div
                      className="h-16 w-24 shrink-0 rounded-sm bg-neutral-200"
                      aria-hidden
                    />
                  )}
                  <h3 className="min-w-0 flex-1 font-sans text-base font-semibold leading-snug tracking-tight text-neutral-900 group-hover:text-red-600">
                    {post.title}
                  </h3>
                </Link>
              </article>
            );
          })}
        </div>

        {/* md+: 2-column grid + third story */}
        <div className="hidden md:block md:space-y-8">
          <div className="grid grid-cols-2 gap-8">
          {moreTopHeadlines.slice(0, 2).map((post) => (
            <article key={post._id}>
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
                  <h3 className="font-sans text-xl font-semibold leading-snug tracking-tight text-neutral-900">
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
                <h3 className="font-sans text-xl font-semibold leading-snug tracking-tight text-neutral-900">
                  {moreTopHeadlines[2].title}
                </h3>
              </Link>
            </div>
          </article>
        )}
        </div>
      </div>
    </div>
  );
}

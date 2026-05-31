import Link from "next/link";
import { ListingPhotoCredit } from "@/app/helpers";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  mainHeadlineMobileTitle,
  mainStoryExcerpt,
  moreTopHeadlinesGridTitle,
  moreTopHeadlinesMobileTitle,
} from "@/app/lib/typography/first-section";

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
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
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

function getCover(post: Post): {
  src: string | null;
  alt: string;
  unoptimized: boolean;
} {
  const coverData = getCoverImage(post.cover, post.title);
  if (!coverData) {
    return { src: null, alt: post.title, unoptimized: false };
  }

  return {
    src: coverData.src,
    alt: coverData.alt,
    unoptimized: coverData.unoptimized,
  };
}

export function CenterColumnLanding({
  mainStory,
  relatedCategoryPosts,
  moreTopHeadlines,
}: CenterColumnLandingProps) {
  return (
    <div className="lg:px-6">
      {/* <SectionHeader title="Top News" variant="light" accentStyle="small-dot" size="regular" /> */}

      {/* Main Story */}
      {mainStory.map((post, index) => (
        <article key={post._id} className="mb-8">
          <Link href={`/post/${post.slug}`} className="hover:text-red-600">
            <h1 className={mainHeadlineMobileTitle}>{post.title}</h1>
          </Link>

          {(() => {
            const { src, alt, unoptimized } = getCover(post);
            if (!src) return null;
            return (
              <>
                <Link href={`/post/${post.slug}`}>
                  <div className="mb-2">
                    <div className="relative aspect-[5/6] w-full overflow-hidden rounded-sm md:aspect-auto md:h-[500px]">
                      <ImageRenderer
                        src={src}
                        alt={alt}
                        width={1000}
                        height={563} // 1000 / 16 * 9 ≈ 562.5
                        unoptimized={unoptimized}
                        quality={70}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 720px"
                        className="rounded-sm object-cover object-center"
                        fill
                      />
                      {post.excerpt && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-12 pb-4 md:px-6 md:pt-16 md:pb-6">
                          <p className={mainStoryExcerpt}>{post.excerpt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <ListingPhotoCredit cover={post.cover} align="right" />
              </>
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
                  <h3 className={moreTopHeadlinesMobileTitle}>{post.title}</h3>
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
                  const { src, alt, unoptimized } = getCover(post);
                  if (!src) return null;
                  return (
                    <>
                      <Link href={`/post/${post.slug}`}>
                        <div className="mb-2">
                          <div className="relative h-[200px] w-full overflow-hidden rounded-sm">
                            <ImageRenderer
                              src={src}
                              alt={alt}
                              width={600}
                              height={500}
                              unoptimized={unoptimized}
                              quality={55}
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                              className="rounded-sm object-cover"
                              fill
                            />
                          </div>
                        </div>
                      </Link>
                      <ListingPhotoCredit
                        cover={post.cover}
                        align="right"
                        className="hidden md:block"
                      />
                    </>
                  );
                })()}
                <div>
                  <Link
                    href={`/post/${post.slug}`}
                    className="hover:text-red-600"
                  >
                    <h3 className={moreTopHeadlinesGridTitle}>{post.title}</h3>
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
                      <div className="relative h-[200px] w-full overflow-hidden rounded-sm">
                        <ImageRenderer
                          src={src}
                          alt={alt}
                          width={600}
                          height={400}
                          unoptimized={unoptimized}
                          quality={55}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                          className="rounded-sm object-cover"
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
                  <h3 className={moreTopHeadlinesGridTitle}>
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

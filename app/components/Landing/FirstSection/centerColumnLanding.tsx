import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingPhotoCredit } from "@/app/helpers";
import { getCoverImage } from "@/sanity/lib/utils";
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
      {/* Main Story */}
      {mainStory.map((post) => (
        <article key={post._id} className="mb-8">
          <Link href={`/post/${post.slug}`} className="group block">
            <h1 className={mainHeadlineMobileTitle}>{post.title}</h1>
          </Link>

          {(() => {
            const { src, alt, unoptimized } = getCover(post);
            if (!src) return null;
            return (
              <>
                <Link href={`/post/${post.slug}`} className="group block">
                  <div className="mb-2">
                    <div className="relative aspect-[5/6] w-full overflow-hidden rounded-sm bg-news-secondary md:aspect-auto md:h-[500px]">
                      <ImageRenderer
                        src={src}
                        alt={alt}
                        width={1000}
                        height={563}
                        unoptimized={unoptimized}
                        quality={70}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 720px"
                        className="object-cover object-center"
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

      {moreTopHeadlines.length > 0 ? (
        <div className="mb-8 md:mb-0">
          {/* Mobile: stacked rows — title left, thumb right */}
          <div className="flex flex-col divide-y divide-dotted divide-news-border md:hidden">
            {moreTopHeadlines.map((post) => {
              const { src, alt, unoptimized } = getCover(post);
              return (
                <article key={post._id} className="py-4 first:pt-0 last:pb-0">
                  <Link
                    href={`/post/${post.slug}`}
                    className="group flex items-start gap-3"
                    aria-label={`Read article: ${post.title}`}
                  >
                    <h3 className={moreTopHeadlinesMobileTitle}>
                      {post.title}
                    </h3>
                    {src ? (
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
                        <ImageRenderer
                          src={src}
                          alt={alt}
                          width={112}
                          height={80}
                          unoptimized={unoptimized}
                          quality={55}
                          sizes="112px"
                          className="object-cover object-center"
                          fill
                        />
                      </div>
                    ) : null}
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="hidden md:grid md:grid-cols-2 md:gap-8">
            {moreTopHeadlines.map((post) => {
              const { src, alt, unoptimized } = getCover(post);
              return (
                <article key={post._id}>
                  {src ? (
                    <Link href={`/post/${post.slug}`} className="group block">
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary">
                        <ImageRenderer
                          src={src}
                          alt={alt}
                          width={600}
                          height={338}
                          unoptimized={unoptimized}
                          quality={55}
                          sizes="(max-width: 1280px) 50vw, 360px"
                          className="object-cover object-center"
                          fill
                        />
                      </div>
                    </Link>
                  ) : null}
                  <Link href={`/post/${post.slug}`} className="group block">
                    <h3 className={cn("mt-4", moreTopHeadlinesGridTitle)}>
                      {post.title}
                    </h3>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { BreakingNewsLabel } from "../../ui/breaking-news-label";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

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
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
}

interface LeftColumnLandingProps {
  latestNews: Post[];
}

export function LeftColumnLanding({ latestNews }: LeftColumnLandingProps) {
  return (
    <div className=" lg:sticky lg:top-20 lg:h-auto lg:overflow-hidden text-left px-0 md:px-4">
      <SectionHeader title="Just in" variant="light" />

      <div className="space-y-6">
        {latestNews.map((post, index) => {
          const isFirstArticle = index === 0;
          const coverData = isFirstArticle
            ? getCoverImage(post.cover, post.title || "Article image")
            : null;

          return (
            <article
              key={post._id}
              className={`${index < latestNews.length - 1 ? "border-b border-neutral-200" : ""} pb-4`}
            >
              {isFirstArticle && coverData?.src && (
                <div className="block mb-3">
                  <Link href={`/post/${post.slug}`}>
                    <div className="relative w-full h-56 md:h-60 overflow-hidden rounded-sm">
                      <ImageRenderer
                        src={coverData.src}
                        alt={coverData.alt}
                        width={600}
                        height={240}
                        fill
                        unoptimized={coverData.unoptimized}
                        quality={60}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 300px"
                        className="object-cover rounded-sm"
                        priority
                      />
                      {isFirstArticle &&
                        (post.breakingNews || post.developingStory) && (
                          <div className="absolute bottom-3 left-3 z-10">
                            <BreakingNewsLabel
                              text={
                                post.breakingNews
                                  ? "Breaking"
                                  : "Developing story"
                              }
                            />
                          </div>
                        )}
                    </div>
                  </Link>
                </div>
              )}
              <Link href={`/post/${post.slug}`} className="hover:text-red-600">
                <h3
                  className={
                    isFirstArticle
                      ? "text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight"
                      : "text-base font-sans font-normal text-neutral-900 leading-normal tracking-normal"
                  }
                >
                  {post.title}
                </h3>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

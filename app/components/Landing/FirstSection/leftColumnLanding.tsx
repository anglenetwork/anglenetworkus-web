import Link from "next/link";
import Image from "next/image";
import { getCoverImage } from "@/sanity/lib/utils";
import { BreakingNewsLabel } from "../../ui/breaking-news-label";
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
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
}

interface LeftColumnLandingProps {
  latestNews: Post[];
}

export function LeftColumnLanding({ latestNews }: LeftColumnLandingProps) {
  return (
    <div className="lg:border-r border-neutral-300 lg:sticky lg:top-20 lg:h-auto lg:overflow-hidden text-left px-0 md:px-4">
      <SectionHeader title="Just in" variant="gradient" />

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
                <Link href={`/post/${post.slug}`} className="block mb-3">
                  <div className="relative w-full h-56 md:h-60 overflow-hidden rounded-sm">
                    <Image
                      src={coverData.src}
                      alt={coverData.alt}
                      fill
                      unoptimized={coverData.unoptimized}
                      quality={60}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 300px"
                      className="object-cover rounded-sm"
                      priority
                    />
                    {post.cover?.imageSource && (
                      <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                        {post.cover.imageSource}
                      </div>
                    )}
                  </div>
                </Link>
              )}
              {isFirstArticle &&
                (post.breakingNews || post.developingStory) && (
                  <div className="mb-3">
                    <BreakingNewsLabel
                      variant="default"
                      text={post.breakingNews ? "Breaking" : "Developing story"}
                    />
                  </div>
                )}
              <Link href={`/post/${post.slug}`} className="hover:text-red-600">
                <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-lg font-normal tracking-wide">
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

import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../../ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import {
  sideStoryCompactTitle,
  sideStoryTitle,
} from "@/app/lib/typography/first-section";

interface Post {
  _id: string;
  title: string;
  slug: string;
  readTime?: number | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
}

interface RightColumnLandingProps {
  sideStories: Post[];
  compactStories: Post[];
}

export function RightColumnLanding({
  sideStories,
  compactStories,
}: RightColumnLandingProps) {
  return (
    <div className="px-0 text-left md:px-4">
      <div className="flex flex-col gap-4">
        {sideStories.map((post) => {
          const coverData = getCoverImage(post.cover, post.title);

          return (
            <article key={post._id} className="space-y-3">
              {coverData ? (
                <Link href={`/post/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary">
                    <ImageRenderer
                      src={coverData.src}
                      alt={coverData.alt}
                      width={600}
                      height={338}
                      unoptimized={coverData.unoptimized}
                      quality={55}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 500px"
                      className="object-cover object-center"
                      fill
                    />
                  </div>
                </Link>
              ) : null}
              <Link href={`/post/${post.slug}`} className="group block">
                <h3 className={sideStoryTitle}>{post.title}</h3>
              </Link>
            </article>
          );
        })}
      </div>

      {compactStories.length > 0 ? (
        <div className="mt-6 flex flex-col">
          {compactStories.map((post) => {
            const coverData = getCoverImage(post.cover, post.title);

            return (
              <article key={post._id} className="py-4 first:pt-0 last:pb-0">
                <Link
                  href={`/post/${post.slug}`}
                  className="group flex items-start gap-3"
                  aria-label={`Read article: ${post.title}`}
                >
                  {coverData ? (
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary">
                      <ImageRenderer
                        src={coverData.src}
                        alt={coverData.alt}
                        width={112}
                        height={80}
                        unoptimized={coverData.unoptimized}
                        quality={55}
                        sizes="112px"
                        className="object-cover object-center"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-sm bg-news-secondary font-sans text-[10px] text-news-muted">
                      No Image
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className={sideStoryCompactTitle}>{post.title}</h3>
                    <ReadTimeLabel minutes={post.readTime} variant="news" />
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

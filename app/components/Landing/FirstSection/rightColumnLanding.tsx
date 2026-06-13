import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../../ui/image-renderer";
import { categoryFeaturedTitle } from "@/app/lib/typography/second-section";

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
}

export function RightColumnLanding({ sideStories }: RightColumnLandingProps) {
  return (
    <div className="px-0 text-left md:px-4">
      <div className="flex flex-col divide-y divide-dotted divide-news-border">
        {sideStories.map((post) => (
          <article key={post._id} className="space-y-3 py-6 first:pt-0">
            {(() => {
              const coverData = getCoverImage(post.cover, post.title);
              if (!coverData) return null;
              return (
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
              );
            })()}
            <Link href={`/post/${post.slug}`} className="group block">
              <h3
                className={cn(
                  categoryFeaturedTitle.news,
                  "xl:text-lg xl:leading-snug",
                )}
              >
                {post.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

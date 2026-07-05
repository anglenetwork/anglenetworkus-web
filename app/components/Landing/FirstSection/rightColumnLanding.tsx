import Link from "next/link";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { ImageRenderer } from "../../ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ColMoreLink } from "./col-more-link";
import {
  rightFeatureHeadline,
  rightMiniHeadline,
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
    <div className="flex h-full flex-col px-6 py-9 lg:py-10 lg:pr-0 lg:pl-8">
      <div>
        <div className="flex flex-col">
          {sideStories.map((post) => {
            const coverData = getHomepageCoverImage(
              "heroSide",
              post.cover,
              post.title,
            );

            return (
              <article key={post._id} className="mb-[30px] last:mb-0">
                {coverData ? (
                  <Link href={`/post/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-angle-paper">
                      <ImageRenderer
                        src={coverData.src}
                        alt={coverData.alt}
                        width={600}
                        height={413}
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
                  <h3 className={rightFeatureHeadline}>{post.title}</h3>
                </Link>
              </article>
            );
          })}
        </div>

        {compactStories.length > 0 ? (
          <div className="mt-1.5 flex flex-col pt-2">
            {compactStories.map((post) => {
              const coverData = getHomepageCoverImage(
                "heroCompact",
                post.cover,
                post.title,
              );

              return (
                <article key={post._id} className="divider-dashed mt-5 pt-5">
                  <Link
                    href={`/post/${post.slug}`}
                    className="group flex items-start justify-between gap-4"
                    aria-label={`Read article: ${post.title}`}
                  >
                    <div>
                      <h3 className={rightMiniHeadline}>{post.title}</h3>
                      <ReadTimeLabel minutes={post.readTime} variant="angle" />
                    </div>
                    {coverData ? (
                      <div className="relative size-16 shrink-0 overflow-hidden bg-angle-paper">
                        <ImageRenderer
                          src={coverData.src}
                          alt={coverData.alt}
                          width={64}
                          height={64}
                          unoptimized={coverData.unoptimized}
                          quality={55}
                          sizes="64px"
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
        ) : null}
      </div>

      {sideStories.length > 0 || compactStories.length > 0 ? (
        <ColMoreLink href="/latest" label="More headlines" />
      ) : null}
    </div>
  );
}

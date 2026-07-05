import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatImageCredit } from "@/sanity/lib/utils";
import {
  getHomepageCoverImage,
  type HomepageCoverSlot,
} from "@/app/lib/homepage/homepage-cover-image";
import { HOMEPAGE_HERO_LCP_IMAGE } from "@/app/lib/homepage/hero-lcp-image";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  belowHeadline,
  heroCaption,
  heroCredit,
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

function getCover(
  post: Post,
  slot: HomepageCoverSlot = "heroMain",
): {
  src: string | null;
  alt: string;
  unoptimized: boolean;
} {
  const coverData = getHomepageCoverImage(slot, post.cover, post.title);
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
  moreTopHeadlines,
}: CenterColumnLandingProps) {
  return (
    <div className="px-6 py-9 lg:px-8 lg:py-10">
      {/* Main Story */}
      {mainStory.map((post) => {
        const { src, alt, unoptimized } = getCover(post);
        const credit = formatImageCredit(post.cover);

        return (
          <article key={post._id}>
            {src ? (
              <>
                <figure className="relative">
                  <Link href={`/post/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/12.4] w-full overflow-hidden bg-angle-paper">
                      <ImageRenderer
                        src={src}
                        alt={alt}
                        width={HOMEPAGE_HERO_LCP_IMAGE.width}
                        height={HOMEPAGE_HERO_LCP_IMAGE.height}
                        unoptimized={unoptimized}
                        quality={HOMEPAGE_HERO_LCP_IMAGE.quality}
                        priority
                        fetchPriority="high"
                        sizes={HOMEPAGE_HERO_LCP_IMAGE.sizes}
                        className="object-cover object-center"
                        fill
                      />
                      {post.excerpt && (
                        <figcaption
                          className={cn(
                            "absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-angle-ink/[0.88] to-transparent px-4 pt-14 pb-4 lg:px-6 lg:pt-16",
                            heroCaption,
                          )}
                        >
                          {post.excerpt}
                        </figcaption>
                      )}
                    </div>
                  </Link>
                </figure>
                {credit ? <p className={heroCredit}>{credit}</p> : null}
              </>
            ) : null}
          </article>
        );
      })}

      {moreTopHeadlines.length > 0 ? (
        <div className="mt-9 grid grid-cols-1 gap-8 border-angle-hairline border-t pt-8 lg:grid-cols-2">
          {moreTopHeadlines.map((post) => {
            const { src, alt, unoptimized } = getCover(post, "heroRail");
            return (
              <article key={post._id}>
                {src ? (
                  <Link href={`/post/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-angle-paper">
                      <ImageRenderer
                        src={src}
                        alt={alt}
                        width={600}
                        height={413}
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
                  <h3 className={belowHeadline}>{post.title}</h3>
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

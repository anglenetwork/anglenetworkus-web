import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getHomepageCoverImage,
  type HomepageCoverSlot,
} from "@/app/lib/homepage/homepage-cover-image";
import { HOMEPAGE_HERO_LCP_IMAGE } from "@/app/lib/homepage/hero-lcp-image";
import { formatReadTimeLabel } from "@/app/lib/typography/read-time";
import {
  mobileFeatureHeadline,
  mobileItemHeadline,
  mobileItemKicker,
  mobileItemTime,
  mobileLeadHeadline,
  mobileLeadReadTime,
  mobileSectionLabel,
} from "@/app/lib/typography/first-section";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { carouselImagesForPost } from "./just-in-carousel-images";
import type { JustInCarouselPost } from "./just-in-carousel-images";
import { JustInCarouselLoader } from "./just-in-carousel-loader";
import { JustInStaticImage } from "./just-in-static-image";

const MOBILE_BREAKING_ASPECT = "aspect-[16/10.5]";
const MOBILE_BREAKING_SIZES = "(max-width: 1023px) 100vw, 300px";

interface MobileStoryPost {
  _id: string;
  title: string;
  slug: string;
  readTime?: number | null;
  labels?: string[] | null;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: unknown;
    alt?: string | null;
  } | null;
}

interface MobileMainStory extends MobileStoryPost {
  excerpt?: string | null;
}

type MobileJustInPost = JustInCarouselPost & MobileStoryPost;

interface MobileFrontLandingProps {
  mainStory: MobileMainStory | null;
  moreTopHeadlines: MobileStoryPost[];
  justInNews: MobileJustInPost[];
  sideStories: MobileStoryPost[];
  compactStories: MobileStoryPost[];
  className?: string;
}

function MobileLabelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-[13px] shrink-0"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="4.5" rx="1" />
      <rect x="4" y="10.75" width="16" height="4.5" rx="1" />
      <rect x="4" y="17.5" width="16" height="4.5" rx="1" />
    </svg>
  );
}

function MobileReadTime({
  minutes,
  className,
}: {
  minutes?: number | null;
  className?: string;
}) {
  const label = formatReadTimeLabel(minutes);
  if (!label) return null;
  return <p className={cn(mobileItemTime, className)}>{label}</p>;
}

function MobileCoverImage({
  post,
  slot,
  aspectClassName,
  width,
  height,
  sizes,
  priority,
}: {
  post: MobileStoryPost;
  slot: HomepageCoverSlot;
  aspectClassName: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
}) {
  const coverData = getHomepageCoverImage(
    slot,
    post.cover as Parameters<typeof getHomepageCoverImage>[1],
    post.title,
  );
  if (!coverData?.src) return null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-angle-paper",
        aspectClassName,
      )}
    >
      <ImageRenderer
        src={coverData.src}
        alt={coverData.alt}
        width={width}
        height={height}
        fill
        unoptimized={coverData.unoptimized}
        quality={priority ? HOMEPAGE_HERO_LCP_IMAGE.quality : 55}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        className="object-cover object-center"
      />
    </div>
  );
}

function MobileThumbImage({
  post,
  slot,
}: {
  post: MobileStoryPost;
  slot: HomepageCoverSlot;
}) {
  const coverData = getHomepageCoverImage(
    slot,
    post.cover as Parameters<typeof getHomepageCoverImage>[1],
    post.title,
  );
  if (!coverData?.src) return null;

  return (
    <div className="relative size-[78px] shrink-0 overflow-hidden bg-angle-paper">
      <ImageRenderer
        src={coverData.src}
        alt={coverData.alt}
        width={78}
        height={78}
        fill
        unoptimized={coverData.unoptimized}
        quality={55}
        sizes="78px"
        className="object-cover object-center"
      />
    </div>
  );
}

function MobileHeroImage({ post }: { post: MobileMainStory }) {
  return (
    <div className="-mx-4 sm:-mx-6">
      <MobileCoverImage
        post={post}
        slot="heroMain"
        aspectClassName="aspect-[4/3]"
        width={HOMEPAGE_HERO_LCP_IMAGE.width}
        height={Math.round((HOMEPAGE_HERO_LCP_IMAGE.width * 3) / 4)}
        sizes="(max-width: 1023px) 100vw, 720px"
        priority
      />
    </div>
  );
}

function MobileLeadItem({ post }: { post: MobileMainStory }) {
  return (
    <div className="flex flex-col pt-[22px] pb-6">
      <Link href={`/post/${post.slug}`} className="group flex flex-col gap-3.5">
        <h2 className={mobileLeadHeadline}>{post.title}</h2>
        <MobileReadTime
          minutes={post.readTime}
          className={mobileLeadReadTime}
        />
      </Link>
    </div>
  );
}

function MobileThumbRow({
  post,
  divider = true,
  label,
  thumbSlot = "heroRail",
}: {
  post: MobileStoryPost;
  divider?: boolean;
  label?: string | null;
  thumbSlot?: HomepageCoverSlot;
}) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className={cn(
        "group flex items-start justify-between gap-4 py-6",
        divider && "divider-dashed",
      )}
      aria-label={`Read article: ${post.title}`}
    >
      <div className="min-w-0 flex-1">
        {label ? (
          <p className={mobileItemKicker}>
            <MobileLabelIcon />
            {label}
          </p>
        ) : null}
        <h3 className={mobileItemHeadline}>{post.title}</h3>
        <MobileReadTime minutes={post.readTime} />
      </div>
      <MobileThumbImage post={post} slot={thumbSlot} />
    </Link>
  );
}

function MobileSectionLabel() {
  return (
    <div className="divider-dashed pt-[26px] pb-1.5">
      <div className={mobileSectionLabel}>
        <span
          className="block size-2 shrink-0 rounded-full border-2 border-angle-red"
          aria-hidden
        />
        Just in
      </div>
    </div>
  );
}

function MobileBreakingRow({ post }: { post: MobileJustInPost }) {
  const carouselImages = carouselImagesForPost(post);
  const showCarousel = carouselImages.length > 1;
  const showStaticImage = carouselImages.length === 1;

  return (
    <div className="flex flex-col py-6 pt-4">
      {showCarousel ? (
        <JustInCarouselLoader
          images={carouselImages}
          postSlug={post.slug}
          breakingNews={post.breakingNews}
          developingStory={post.developingStory}
          imageAspectClassName={MOBILE_BREAKING_ASPECT}
          imageSizes={MOBILE_BREAKING_SIZES}
          className="mb-4 block"
        />
      ) : showStaticImage ? (
        <JustInStaticImage
          image={carouselImages[0]}
          postSlug={post.slug}
          breakingNews={post.breakingNews}
          developingStory={post.developingStory}
          imageAspectClassName={MOBILE_BREAKING_ASPECT}
          imageSizes={MOBILE_BREAKING_SIZES}
          className="mb-4 block"
        />
      ) : (
        <Link
          href={`/post/${post.slug}`}
          className="group mb-4 block"
          aria-label={`Read article: ${post.title}`}
        >
          <MobileCoverImage
            post={post}
            slot="heroRail"
            aspectClassName={MOBILE_BREAKING_ASPECT}
            width={700}
            height={450}
            sizes={MOBILE_BREAKING_SIZES}
          />
        </Link>
      )}
      <Link
        href={`/post/${post.slug}`}
        className="group block"
        aria-label={`Read article: ${post.title}`}
      >
        <h3 className={mobileItemHeadline}>{post.title}</h3>
        <MobileReadTime minutes={post.readTime} />
      </Link>
    </div>
  );
}

function MobileFeatureRow({ post }: { post: MobileStoryPost }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group divider-dashed flex flex-col py-6"
      aria-label={`Read article: ${post.title}`}
    >
      <div className="mb-4">
        <MobileCoverImage
          post={post}
          slot="heroSide"
          aspectClassName={MOBILE_BREAKING_ASPECT}
          width={700}
          height={460}
          sizes={MOBILE_BREAKING_SIZES}
        />
      </div>
      <h3 className={mobileFeatureHeadline}>{post.title}</h3>
      <MobileReadTime minutes={post.readTime} />
    </Link>
  );
}

export function MobileFrontLanding({
  mainStory,
  moreTopHeadlines,
  justInNews,
  sideStories,
  compactStories,
  className,
}: MobileFrontLandingProps) {
  const justInWithSlug = justInNews.filter((post) => !!post.slug);
  const [breakingPost, ...remainingJustIn] = justInWithSlug;

  if (!mainStory?.slug) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <MobileHeroImage post={mainStory} />

      <MobileLeadItem post={mainStory} />

      {moreTopHeadlines.map((post) => (
        <MobileThumbRow key={post._id} post={post} />
      ))}

      {breakingPost ? (
        <>
          <MobileSectionLabel />
          <MobileBreakingRow post={breakingPost} />
        </>
      ) : null}

      {remainingJustIn.map((post) => (
        <MobileThumbRow
          key={post._id}
          post={post}
          label={post.labels?.[0] ?? null}
        />
      ))}

      {sideStories.map((post) => (
        <MobileFeatureRow key={post._id} post={post} />
      ))}

      {compactStories.map((post) => (
        <MobileThumbRow key={post._id} post={post} thumbSlot="heroCompact" />
      ))}
    </div>
  );
}

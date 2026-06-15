import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { tagFeaturedOverlayTitle } from "@/app/lib/typography/tag-page";

const featuredImageOverlayClassName =
  "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pt-12 pb-4 md:px-6 md:pt-16 md:pb-6";

interface TagFeaturedArticleProps {
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
  href?: string;
  readTimeMinutes?: number | null;
}

export function TagFeaturedArticle({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  slug,
  href,
  readTimeMinutes,
}: TagFeaturedArticleProps) {
  const articleHref = href ?? `/post/${slug}`;

  return (
    <article className="group">
      <Link
        href={articleHref}
        className="block"
        aria-label={`Read article: ${title}`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-950">
          {image ? (
            <ImageRenderer
              src={image}
              alt={imageAlt}
              width={1200}
              height={675}
              fill
              unoptimized={imageUnoptimized}
              quality={75}
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="absolute inset-0 z-0 object-cover object-center"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral-200">
              <span className="text-neutral-400">No Image</span>
            </div>
          )}
          <div className={featuredImageOverlayClassName}>
            <h1 className={tagFeaturedOverlayTitle}>{title}</h1>
            <ReadTimeLabel minutes={readTimeMinutes} variant="hero" as="span" />
          </div>
        </div>
      </Link>
    </article>
  );
}

import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { categoryFeaturedTitle } from "@/app/lib/typography/second-section";
import { tagReadTimeLabel } from "@/app/lib/typography/tag-page";
import { cn } from "@/lib/utils";

interface FeaturedArticleBlockProps {
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  title: string;
  href: string;
  readTime?: string;
  priority?: boolean;
  titleAs?: "h1" | "h2" | "h3";
  sizes?: string;
  imageWrapperClassName?: string;
}

export function FeaturedArticleBlock({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  href,
  readTime,
  priority = false,
  titleAs: TitleTag = "h2",
  sizes = "(max-width: 1024px) 100vw, 66vw",
  imageWrapperClassName,
}: FeaturedArticleBlockProps) {
  return (
    <article className="group">
      <Link href={href} className="block" aria-label={`Read article: ${title}`}>
        <div
          className={cn(
            "relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-950",
            imageWrapperClassName,
          )}
        >
          {image ? (
            <ImageRenderer
              src={image}
              alt={imageAlt}
              width={1200}
              height={675}
              fill
              unoptimized={imageUnoptimized}
              quality={75}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
              sizes={sizes}
              className="object-cover object-center"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-neutral-200">
              <span className="text-neutral-400">No Image</span>
            </div>
          )}
        </div>
      </Link>
      <Link href={href} className="group/title block">
        <TitleTag className={cn("mt-4", categoryFeaturedTitle.light)}>
          {title}
        </TitleTag>
      </Link>
      {readTime ? <p className={tagReadTimeLabel}>{readTime}</p> : null}
    </article>
  );
}

import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";
import { tagReadTimeLabel } from "@/app/lib/typography/tag-page";

interface SecondaryArticleRowProps {
  image: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  title: string;
  readTime: string;
  href: string;
}

export function SecondaryArticleRow({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  readTime,
  href,
}: SecondaryArticleRowProps) {
  return (
    <article className="group">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <Link href={href} className="block">
            <h3 className={categorySecondaryRowTitle.light}>{title}</h3>
          </Link>
          <p className={tagReadTimeLabel}>{readTime}</p>
        </div>
        <Link
          href={href}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-neutral-950"
          aria-label={`Read article: ${title}`}
        >
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt={imageAlt?.trim() || title}
            width={112}
            height={80}
            fill
            unoptimized={imageUnoptimized}
            quality={60}
            sizes="112px"
            className="object-cover object-center"
          />
        </Link>
      </div>
    </article>
  );
}

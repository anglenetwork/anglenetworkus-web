import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { categorySecondaryRowTitle } from "@/app/lib/typography/second-section";

interface SecondaryArticleRowProps {
  image: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  title: string;
  readTimeMinutes?: number | null;
  href: string;
}

export function SecondaryArticleRow({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  readTimeMinutes,
  href,
}: SecondaryArticleRowProps) {
  return (
    <article className="group">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <Link href={href} className="block">
            <h3 className={categorySecondaryRowTitle.light}>{title}</h3>
          </Link>
          <ReadTimeLabel minutes={readTimeMinutes} />
        </div>
        <Link
          href={href}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-news-secondary"
          aria-label={`Read article: ${title}`}
        >
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt={imageAlt?.trim() || title}
            width={112}
            height={80}
            fill
            unoptimized={imageUnoptimized}
            sizes="112px"
            className="object-cover object-center"
          />
        </Link>
      </div>
    </article>
  );
}

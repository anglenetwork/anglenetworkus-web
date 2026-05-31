import Link from "next/link";
import type { Article } from "./types";
import { articleTitleLink } from "@/app/lib/typography/article-links";
import { ImageRenderer } from "../ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

interface MostReadItemProps {
  article: Article;
  index: number;
  isFirst?: boolean;
}

export function MostReadItem({
  article,
  index,
  isFirst = false,
}: MostReadItemProps) {
  return (
    <article className="group">
      {isFirst && article.imageUrl && (
        <Link
          href={article.href ?? `/post/${article.slug}`}
          className="mb-4 block"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-sm">
            <ImageRenderer
              src={article.imageUrl}
              alt={article.title}
              width={640}
              height={360}
              fill
              unoptimized={article.imageUnoptimized}
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
            />
          </div>
        </Link>
      )}
      <div className="flex gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 font-sans font-semibold text-blue-700 text-sm">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-medium font-sans text-base text-neutral-900 leading-snug tracking-normal">
            <Link
              href={article.href ?? `/post/${article.slug}`}
              className={articleTitleLink}
            >
              {article.title}
            </Link>
          </h3>
          <ReadTimeLabel minutes={article.readTime} />
        </div>
      </div>
    </article>
  );
}

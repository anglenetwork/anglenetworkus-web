import Link from "next/link";
import type { Article } from "./types";
import { ImageRenderer } from "../ui/image-renderer";

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
        <Link href={`/post/${article.slug}`} className="block mb-4">
          <div className="relative w-full aspect-video overflow-hidden rounded-sm">
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
        <div className="flex-shrink-0 w-8 h-8 font-secondary bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-sans font-medium text-neutral-900 leading-snug tracking-normal">
            <Link href={`/post/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>
        </div>
      </div>
    </article>
  );
}

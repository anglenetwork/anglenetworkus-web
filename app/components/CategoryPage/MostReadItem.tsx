import Link from "next/link";
import type { Article } from "./types";

interface MostReadItemProps {
  article: Article;
  index: number;
}

export function MostReadItem({ article, index }: MostReadItemProps) {
  return (
    <article className="group">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 font-secondary bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-sans font-normal text-neutral-900 leading-snug tracking-normal">
            <Link href={`/post/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-secondary">
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}

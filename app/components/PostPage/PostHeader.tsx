import Link from "next/link";
import {
  regularPostCategory,
  regularPostExcerpt,
  regularPostTitle,
} from "@/app/lib/typography/posts";
import { cn } from "@/lib/utils";
import { REGULAR_POST_BYLINE_ROW_CLASS } from "./PostBody/constants";
import ArticleActions from "./PostBody/ArticleActions";
import ArticleByline from "./PostBody/ArticleByline";

interface PostHeaderProps {
  category?: { title: string; slug: string };
  title: string;
  excerpt?: string;
  date: string;
  updatedAt?: string | null;
  author?: { name: string; picture?: unknown };
  slug?: string;
  articleId?: string;
  sharePath?: string;
}

export default function PostHeader({
  category,
  title,
  excerpt,
  date,
  updatedAt,
  author,
  slug,
  articleId,
  sharePath,
}: PostHeaderProps) {
  const shareUrl = sharePath ?? (slug ? `/post/${slug}` : "");

  return (
    <header className="not-prose mb-8">
      {category && (
        <div className="mb-1">
          <Link
            href={`/category/${category.slug}`}
            className={regularPostCategory}
          >
            {category.title}
          </Link>
        </div>
      )}

      {/* Matches Portable Text h1 scale in PostBody */}
      <h1 className={cn(regularPostTitle, "mb-4 text-start")}>{title}</h1>

      {excerpt && <p className={cn(regularPostExcerpt, "mb-4")}>{excerpt}</p>}

      <div className={REGULAR_POST_BYLINE_ROW_CLASS}>
        <ArticleByline
          author={author}
          date={date}
          updatedAt={updatedAt}
          layout="inline"
          showAvatar="xl"
        />
        <ArticleActions
          articleId={articleId}
          slug={slug}
          title={title}
          shareUrl={shareUrl}
        />
      </div>
    </header>
  );
}

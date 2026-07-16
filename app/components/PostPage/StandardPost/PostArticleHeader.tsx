import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  postArticleDek,
  postArticleKicker,
  postArticleTitle,
} from "@/app/lib/typography/post-standard";
import type { ArticleAuthor } from "../PostBody/types";
import PostArticleByline from "./PostArticleByline";

interface PostArticleHeaderProps {
  category?: { title: string; slug: string };
  title: string;
  excerpt?: string;
  date: string;
  updatedAt?: string | null;
  author?: ArticleAuthor;
  readTime?: number | null;
  slug?: string;
  articleId?: string;
  sharePath?: string;
}

export default function PostArticleHeader({
  category,
  title,
  excerpt,
  date,
  updatedAt,
  author,
  readTime,
  slug,
  articleId,
  sharePath,
}: PostArticleHeaderProps) {
  return (
    <header className="not-prose pb-2 lg:pb-4">
      {category && (
        <Link
          href={`/category/${category.slug}`}
          className={cn("group mb-4 inline-block", postArticleKicker)}
        >
          <span className="group-hover:underline">{category.title}</span>
        </Link>
      )}

      <h1 className={cn(postArticleTitle, "mb-5 text-start")}>{title}</h1>

      {excerpt && (
        <p className={cn(postArticleDek, "mb-3 lg:mb-6")}>{excerpt}</p>
      )}

      <PostArticleByline
        className="hidden lg:flex"
        date={date}
        updatedAt={updatedAt}
        author={author}
        readTime={readTime}
        slug={slug}
        articleId={articleId}
        title={title}
        sharePath={sharePath}
      />
    </header>
  );
}

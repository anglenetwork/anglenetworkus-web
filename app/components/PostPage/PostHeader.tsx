import Link from "next/link";
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
    <header className="mb-8 not-prose">
      {category && (
        <div className="mb-1">
          <Link
            href={`/category/${category.slug}`}
            className="text-sm font-sans font-medium uppercase tracking-wider text-foreground"
          >
            {category.title}
          </Link>
        </div>
      )}

      {/* Matches Portable Text h1 scale in PostBody */}
      <h1 className="font-sans font-semibold tracking-tight text-[28px] leading-[1.2] sm:text-[40px] sm:leading-tight md:text-[44px] text-neutral-900 mb-4 text-start">
        {title}
      </h1>

      {excerpt && (
        <p className="text-sm md:text-lg text-neutral-500 mb-4 leading-relaxed font-sans font-light tracking-snug">
          {excerpt}
        </p>
      )}

      <div className="space-y-3 font-sans xl:flex xl:items-center xl:justify-between xl:gap-4 xl:space-y-0">
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

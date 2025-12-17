import Link from "next/link";

interface PostHeaderProps {
  category?: { title: string; slug: string };
  title: string;
  excerpt?: string;
  date: string;
  author?: { name: string; picture?: any };
  slug?: string;
}

export default function PostHeader({
  category,
  title,
  excerpt,
  date,
  author,
  slug,
}: PostHeaderProps) {
  return (
    <header className="mb-8 not-prose">
      {category && (
        <div className="mb-1">
          <Link
            href={`/category/${category.slug}`}
            className="text-sm font-sans font-medium uppercase tracking-wider text-foreground text-neutral-900"
          >
            {category.title}
          </Link>
        </div>
      )}

      <h1 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 !leading-tight tracking-tighter mb-4 font-sans text-start">
        {title}
      </h1>

      {excerpt && (
        <p className="text-sm lg:text-sm text-neutral-500 mb-6 leading-relaxed font-secondary font-light tracking-snug">
          {excerpt}
        </p>
      )}
    </header>
  );
}

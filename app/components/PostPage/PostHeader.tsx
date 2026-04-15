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
            className="text-sm font-sans font-medium uppercase tracking-wider text-foreground"
          >
            {category.title}
          </Link>
        </div>
      )}

      {/* Matches Portable Text h1 scale in PostBody */}
      <h1 className="font-sans font-semibold tracking-tight text-[34px] sm:text-[40px] md:text-[44px] text-neutral-900 leading-tight mb-4 text-start">
        {title}
      </h1>

      {excerpt && (
        <p className="text-sm lg:text-sm text-neutral-500 mb-6 leading-relaxed font-sans font-light tracking-snug">
          {excerpt}
        </p>
      )}
    </header>
  );
}

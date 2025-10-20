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
        <div className="mb-2">
          <Link
            href={`/category/${category.slug}`}
            className="font-inter uppercase text-xs font-medium text-neutral-900 tracking-wider"
          >
            {category.title}
          </Link>
        </div>
      )}

      <h1 className="font-outfit text-2xl lg:text-4xl font-semibold text-neutral-900 mb-4 leading-tight">
        {title}
      </h1>

      {excerpt && (
        <p className="text-base lg:text-base text-neutral-900 mb-6 leading-relaxed font-inter font-light">
          {excerpt}
        </p>
      )}
    </header>
  );
}

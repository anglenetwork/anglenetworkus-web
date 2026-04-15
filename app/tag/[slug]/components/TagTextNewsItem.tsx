import Link from "next/link";

interface TagTextNewsItemProps {
  title: string;
  slug: string;
  href?: string;
}

export function TagTextNewsItem({ title, slug, href }: TagTextNewsItemProps) {
  return (
    <article className="py-4">
      <Link href={href ?? `/post/${slug}`} className="block">
        <h3 className="text-base font-sans font-normal text-neutral-900 leading-normal tracking-normal">
          {title}
        </h3>
      </Link>
    </article>
  );
}

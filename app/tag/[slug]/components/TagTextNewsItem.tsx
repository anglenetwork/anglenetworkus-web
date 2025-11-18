import Link from "next/link";

interface TagTextNewsItemProps {
  title: string;
  slug: string;
}

export function TagTextNewsItem({ title, slug }: TagTextNewsItemProps) {
  return (
    <article className="py-4">
      <Link href={`/post/${slug}`} className="block">
        <h3 className="text-base font-sans font-normal text-neutral-900 leading-normal tracking-normal">
          {title}
        </h3>
      </Link>
    </article>
  );
}

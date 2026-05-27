import Link from "next/link";
import { tagTextOnlyTitle } from "@/app/lib/typography/tag-page";

interface TagTextNewsItemProps {
  title: string;
  slug: string;
  href?: string;
}

export function TagTextNewsItem({ title, slug, href }: TagTextNewsItemProps) {
  return (
    <article className="py-4">
      <Link href={href ?? `/post/${slug}`} className="block">
        <h3 className={tagTextOnlyTitle}>{title}</h3>
      </Link>
    </article>
  );
}

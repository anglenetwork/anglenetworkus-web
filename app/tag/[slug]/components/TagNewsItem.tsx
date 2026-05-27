import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { tagDarkRailTitle } from "@/app/lib/typography/tag-page";

interface TagNewsItemProps {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  readTime: string;
  slug: string;
  href?: string;
}

export function TagNewsItem({
  image,
  imageUnoptimized,
  title,
  readTime,
  slug,
  href,
}: TagNewsItemProps) {
  const to = href ?? `/post/${slug}`;
  return (
    <article className="flex gap-4 py-6">
      <div className="flex-1">
        <Link href={to} className="block">
          <h2 className={tagDarkRailTitle}>{title}</h2>
        </Link>
        <p className="mt-2 font-sans font-semibold text-neutral-400 text-xs capitalize tracking-wide">
          {readTime}
        </p>
      </div>
      <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
        <Link href={to} className="block h-full">
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt={title}
            width={128}
            height={80}
            fill
            unoptimized={imageUnoptimized}
            quality={60}
            sizes="128px"
            className="object-cover"
          />
        </Link>
      </div>
    </article>
  );
}

import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";

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
          <h2 className="text-base font-sans font-normal text-white leading-normal tracking-normal">
            {title}
          </h2>
        </Link>
        <p className="mt-2 text-xs font-sans font-semibold capitalize tracking-wide text-neutral-400">
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

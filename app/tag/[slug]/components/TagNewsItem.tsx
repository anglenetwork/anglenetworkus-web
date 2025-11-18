import Image from "next/image";
import Link from "next/link";

interface TagNewsItemProps {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  readTime: string;
  slug: string;
}

export function TagNewsItem({
  image,
  imageUnoptimized,
  title,
  readTime,
  slug,
}: TagNewsItemProps) {
  return (
    <article className="flex gap-4 py-6">
      <div className="flex-1">
        <Link href={`/post/${slug}`} className="block">
          <h2 className="text-lg font-sans font-normal text-neutral-900 leading-normal tracking-normal">
            {title}
          </h2>
        </Link>
        <p className="mt-2 text-xs font-secondary font-semibold capitalize tracking-wide text-muted-foreground">
          {readTime}
        </p>
      </div>
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
        <Link href={`/post/${slug}`} className="block h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
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

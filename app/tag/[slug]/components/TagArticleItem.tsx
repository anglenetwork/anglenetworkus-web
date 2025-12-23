import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";

interface TagArticleItemProps {
  image: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
}

export function TagArticleItem({
  image,
  imageUnoptimized,
  title,
  slug,
}: TagArticleItemProps) {
  return (
    <article className="flex gap-6 py-4 first:pt-0">
      <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg">
        <Link href={`/post/${slug}`} className="block h-full">
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt={title}
            width={160}
            height={112}
            fill
            unoptimized={imageUnoptimized}
            quality={60}
            sizes="160px"
            className="object-cover"
          />
        </Link>
      </div>
      <Link href={`/post/${slug}`} className="block flex-1">
        <h2 className="text-lg font-sans font-normal text-neutral-900 leading-normal tracking-normal">
          {title}
        </h2>
      </Link>
    </article>
  );
}

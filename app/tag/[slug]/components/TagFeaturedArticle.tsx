import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { tagFeaturedTitle } from "@/app/lib/typography/tag-page";

interface TagFeaturedArticleProps {
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
  href?: string;
}

export function TagFeaturedArticle({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  slug,
  href,
}: TagFeaturedArticleProps) {
  return (
    <article className="mb-8">
      <Link href={href ?? `/post/${slug}`} className="group block">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          {image ? (
            <ImageRenderer
              src={image}
              alt={imageAlt}
              width={1200}
              height={675}
              fill
              unoptimized={imageUnoptimized}
              quality={75}
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h1 className={tagFeaturedTitle}>{title}</h1>
        </div>
      </Link>
    </article>
  );
}

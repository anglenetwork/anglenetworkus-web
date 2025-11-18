import Image from "next/image";
import Link from "next/link";

interface TagFeaturedArticleProps {
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
}

export function TagFeaturedArticle({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  slug,
}: TagFeaturedArticleProps) {
  return (
    <article className="mb-8">
      <Link href={`/post/${slug}`} className="block group">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              unoptimized={imageUnoptimized}
              quality={75}
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h1 className="mt-2 text-2xl md:text-3xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight text-start">
            {title}
          </h1>
        </div>
      </Link>
    </article>
  );
}

import Link from "next/link";
import { ImageRenderer } from "../../ui/image-renderer";

interface ArticleCardAlternativeProps {
  category: string;
  title: string;
  description?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  imageSource?: string;
  isDecorative?: boolean;
  slug?: string;
  /** Full path for article-family routes (e.g. /opinion/slug). Defaults to /post/{slug}. */
  href?: string;
  readTime?: number;
}

export default function ArticleCardAlternative({
  category,
  title,
  description,
  author,
  image,
  imageAlt,
  imageUnoptimized,
  imageSource,
  isDecorative = false,
  slug = "#",
  href: hrefProp,
  readTime = 5,
}: ArticleCardAlternativeProps) {
  const to = hrefProp ?? (slug && slug !== "#" ? `/post/${slug}` : "#");
  return (
    <div>
      <Link href={to} className="block">
        <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200">
          <div className="absolute inset-0">
            <ImageRenderer
              src={image || "/placeholder.svg"}
              alt={imageAlt || title}
              width={300}
              height={400}
              fill
              unoptimized={imageUnoptimized}
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover rounded-sm"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-sans font-semibold text-white leading-snug tracking-tight mb-2">
              {title}
            </h3>

            <div className="flex items-center gap-2">
              {/* <Play className="h-4 w-4 fill-white" /> */}
              <span className="text-xs font-sans font-light">
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

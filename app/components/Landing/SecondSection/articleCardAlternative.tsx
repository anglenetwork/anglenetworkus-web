import Link from "next/link";
import { ExcerptCreditCaption } from "@/app/helpers";
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
        <div className="relative h-[400px] w-full cursor-pointer overflow-hidden rounded-lg bg-black transition-opacity duration-200 hover:opacity-90">
          <div className="absolute inset-0">
            <ImageRenderer
              src={image || "/placeholder.svg"}
              alt={imageAlt || title}
              width={300}
              height={400}
              fill
              unoptimized={imageUnoptimized}
              sizes="(max-width: 768px) 100vw, 300px"
              className="rounded-sm object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
            <h3 className="mb-2 font-sans font-semibold text-white text-xl leading-snug tracking-tight">
              {title}
            </h3>

            <div className="flex items-center gap-2">
              {/* <Play className="h-4 w-4 fill-white" /> */}
              <span className="font-light font-sans text-xs">
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </Link>
      {imageSource ? (
        <ExcerptCreditCaption
          credit={imageSource}
          align="right"
          variant="compact"
        />
      ) : null}
    </div>
  );
}

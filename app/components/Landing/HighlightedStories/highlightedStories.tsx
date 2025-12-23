import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

interface Article {
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface HighlightedStoriesProps {
  leftArticle: Article;
  leftSmallArticles: Article[];
  rightArticle: Article;
  rightSmallArticles: Article[];
}

export default function HighlightedStories({
  leftArticle,
  leftSmallArticles,
  rightArticle,
  rightSmallArticles,
}: HighlightedStoriesProps) {
  const leftCoverData = getCoverImage(
    leftArticle.cover,
    leftArticle.title || "Featured article"
  );
  const rightCoverData = getCoverImage(
    rightArticle.cover,
    rightArticle.title || "Featured article"
  );

  return (
    <main className="bg-background text-foreground">
      {/* Main container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-0">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Section Header */}
          <SectionHeader
            title={leftArticle.category?.title || "More Top Headlines"}
            variant="light"
          />

          {/* Featured Article */}
          <article className="space-y-3">
            {leftCoverData?.src && (
              <Link href={`/post/${leftArticle.slug}`}>
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
                  <ImageRenderer
                    src={leftCoverData.src}
                    alt={leftCoverData.alt}
                    width={800}
                    height={320}
                    fill
                    unoptimized={leftCoverData.unoptimized}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            )}
            <Link href={`/post/${leftArticle.slug}`}>
              <h2 className="text-3xl font-sans font-bold leading-tight tracking-tight pt-2">
                {leftArticle.title}
              </h2>
            </Link>
          </article>

          {/* Small Articles Grid - 1 column on mobile, 2 columns on desktop */}
          {leftSmallArticles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {leftSmallArticles.map((article, idx) => (
                <div key={article.slug || idx}>
                  <Link
                    href={`/post/${article.slug}`}
                    className="text-neutral-900 leading-snug font-sans text-lg sm:text-base font-normal tracking-tight block pb-6"
                  >
                    {article.title}
                  </Link>
                  {idx < leftSmallArticles.length - 1 && (
                    <hr className="border-t border-gray-200 -mt-2 mb-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Section Header */}
          <SectionHeader
            title={rightArticle.category?.title || "More Top Headlines"}
            variant="light"
          />

          {/* Featured Article */}
          <article className="space-y-3">
            {rightCoverData?.src && (
              <Link href={`/post/${rightArticle.slug}`}>
                <div className="relative w-full h-80 rounded-lg overflow-hidden">
                  <ImageRenderer
                    src={rightCoverData.src}
                    alt={rightCoverData.alt}
                    width={800}
                    height={320}
                    fill
                    unoptimized={rightCoverData.unoptimized}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Link>
            )}
            <Link href={`/post/${rightArticle.slug}`}>
              <h2 className="text-3xl font-sans font-bold leading-tight tracking-tight pt-2">
                {rightArticle.title}
              </h2>
            </Link>
          </article>

          {/* Small Articles Grid - 1 column on mobile, 2 columns on desktop */}
          {rightSmallArticles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rightSmallArticles.map((article, idx) => (
                <div key={article.slug || idx}>
                  <Link
                    href={`/post/${article.slug}`}
                    className="text-neutral-900 leading-snug font-sans text-lg sm:text-base font-normal tracking-tight block pb-6"
                  >
                    {article.title}
                  </Link>
                  {idx < rightSmallArticles.length - 1 && (
                    <hr className="border-t border-gray-200 -mt-2 mb-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ExcerptCreditCaption } from "@/app/helpers";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";

interface CenterArticle {
  id: string;
  title: string;
  author: string;
  coAuthor: string;
  thirdAuthor?: string;
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  imageSource?: string;
  isMain: boolean;
  slug: string;
}

interface CenterColumnThirdProps {
  centerArticles: CenterArticle[];
  categoryTitle: string;
}

export function CenterColumnFifth({
  centerArticles,
  categoryTitle,
}: CenterColumnThirdProps) {
  return (
    <div className="border-gray-200 border-r px-6">
      {/* Congress Section */}
      <div className="mb-8">
        <SectionHeader
          title={categoryTitle}
          variant="light"
          accentStyle="geometric-square"
          size="large"
          href={`/category/${categoryTitle.toLowerCase()}`}
        />

        {/* Articles */}
        {centerArticles.map((article, index) => (
          <div key={article.id}>
            {article.isMain ? (
              // Main Article
              <div className="mb-6">
                <div className="mb-4">
                  <Link href={`/post/${article.slug}`}>
                    <ImageRenderer
                      src={article.image}
                      alt={article.imageAlt}
                      width={800}
                      height={320}
                      unoptimized={article.imageUnoptimized}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                      className="h-80 w-full cursor-pointer rounded-sm object-cover"
                    />
                  </Link>
                  <ExcerptCreditCaption
                    credit={article.imageSource}
                    align="right"
                    variant="compact"
                  />
                </div>
                <Link href={`/post/${article.slug}`}>
                  <h3 className="text-start font-sans font-semibold text-3xl text-neutral-900 leading-snug tracking-tight">
                    {article.title}
                  </h3>
                </Link>
              </div>
            ) : null}
          </div>
        ))}

        {/* Secondary Articles in Row Layout */}
        {centerArticles.filter((article) => !article.isMain).length > 0 && (
          <div className="border-gray-300 border-t pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {centerArticles
                .filter((article) => !article.isMain)
                .map((article, index) => (
                  <div key={article.id} className="flex flex-col">
                    <div className="mb-3">
                      <Link href={`/post/${article.slug}`}>
                        <ImageRenderer
                          src={article.image}
                          alt={article.imageAlt}
                          width={240}
                          height={160}
                          unoptimized={article.imageUnoptimized}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 240px"
                          className="h-48 w-full cursor-pointer rounded-sm object-cover transition-opacity hover:opacity-90"
                        />
                      </Link>
                    </div>
                    <Link href={`/post/${article.slug}`}>
                      <h3 className="font-normal font-sans text-base text-neutral-900 leading-normal tracking-normal">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

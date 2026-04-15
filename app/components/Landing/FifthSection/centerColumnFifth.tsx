import Link from "next/link";
import { formatImageCredit } from "@/sanity/lib/utils";
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
    <div className="border-r border-gray-200 px-6">
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
                      className="w-full h-80 object-cover rounded-sm cursor-pointer"
                    />
                  </Link>
                  {/* {article.imageSource && (
                    <p className="text-[10px] text-gray-500 font-sans text-right">
                      {article.imageSource}
                    </p>
                  )} */}
                </div>
                <Link href={`/post/${article.slug}`}>
                  <h3 className="text-3xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight text-start">
                    {article.title}
                  </h3>
                </Link>
              </div>
            ) : null}
          </div>
        ))}

        {/* Secondary Articles in Row Layout */}
        {centerArticles.filter((article) => !article.isMain).length > 0 && (
          <div className="border-t border-gray-300 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          className="w-full h-48 object-cover rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>
                    </div>
                    <Link href={`/post/${article.slug}`}>
                      <h3 className="text-base font-sans font-normal text-neutral-900 leading-normal tracking-normal">
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

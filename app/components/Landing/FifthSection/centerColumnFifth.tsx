import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "../../ui/section-header";

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
          variant="gradient"
          href={`/category/${categoryTitle.toLowerCase()}`}
        />

        {/* Articles */}
        {centerArticles.map((article, index) => (
          <div key={article.id}>
            {article.isMain ? (
              // Main Article
              <div className="mb-6">
                <Link href={`/post/${article.slug}`}>
                  <div className="relative mb-4">
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      width={800}
                      height={320}
                      unoptimized={article.imageUnoptimized}
                      className="w-full h-80 object-cover rounded-sm cursor-pointer"
                    />
                    {article.imageSource && (
                      <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                        {article.imageSource}
                      </div>
                    )}
                  </div>
                </Link>
                <Link href={`/post/${article.slug}`}>
                  <h3 className="text-3xl md:text-3xl lg:text-3xl font-medium text-gray-900 leading-tight mb-4 font-sans text-start">
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
                    <Link href={`/post/${article.slug}`}>
                      <div className="relative mb-3">
                        <Image
                          src={article.image}
                          alt={article.imageAlt}
                          width={240}
                          height={160}
                          unoptimized={article.imageUnoptimized}
                          className="w-full h-48 object-cover rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        {article.imageSource && (
                          <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                            {article.imageSource}
                          </div>
                        )}
                      </div>
                    </Link>
                    <Link href={`/post/${article.slug}`}>
                      <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-base font-normal tracking-wide">
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

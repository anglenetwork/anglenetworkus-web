import Image from "next/image";
import Link from "next/link";

interface CenterArticle {
  id: string;
  title: string;
  author: string;
  coAuthor: string;
  thirdAuthor?: string;
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
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
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-sans">
            {categoryTitle}
          </h2>
        </div>
        <div className="border-t border-neutral-200 mb-6"></div>

        {/* Articles */}
        {centerArticles.map((article, index) => (
          <div key={article.id}>
            {article.isMain ? (
              // Main Article
              <div className="mb-6">
                <Link href={`/post/${article.slug}`}>
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    width={800}
                    height={320}
                    unoptimized={article.imageUnoptimized}
                    className="w-full h-80 object-cover rounded-xl mb-4 cursor-pointer"
                  />
                </Link>
                <Link href={`/post/${article.slug}`}>
                  <h1 className="text-3xl md:text-3xl lg:text-3xl font-semibold text-gray-900 leading-tight mb-4 font-sans text-start">
                    {article.title}
                  </h1>
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
                      <Image
                        src={article.image}
                        alt={article.imageAlt}
                        width={240}
                        height={160}
                        unoptimized={article.imageUnoptimized}
                        className="w-full h-48 object-cover rounded-xl mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <Link href={`/post/${article.slug}`}>
                      <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-lg line-clamp-3 font-medium tracking-wide">
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

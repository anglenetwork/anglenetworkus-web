import Image from "next/image";
import Link from "next/link";

interface CongressArticle {
  id: string;
  title: string;
  author: string;
  coAuthor: string;
  thirdAuthor?: string;
  image: string;
  imageAlt: string;
  isMain: boolean;
  slug: string;
}

interface CenterColumnThirdProps {
  congressArticles: CongressArticle[];
  categoryTitle: string;
}

export function CenterColumnThird({
  congressArticles,
  categoryTitle,
}: CenterColumnThirdProps) {
  return (
    <div className="border-r border-gray-200 px-6">
      {/* Congress Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-outfit">
            {categoryTitle}
          </h2>
        </div>
        <div className="border-t border-black mb-6"></div>

        {/* Congress Articles */}
        {congressArticles.map((article, index) => (
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
                    className="w-full h-80 object-cover rounded-xl mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
                <Link href={`/post/${article.slug}`}>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-3 font-outfit cursor-pointer hover:text-gray-700 transition-colors">
                    {article.title}
                  </h1>
                </Link>
              </div>
            ) : (
              // Secondary Articles
              <div
                className={`${index < congressArticles.length - 1 ? "border-t border-gray-300 pt-6 mb-6" : "border-t border-gray-300 pt-6"}`}
              >
                <div className="flex gap-4">
                  <Link href={`/post/${article.slug}`}>
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      width={160}
                      height={112}
                      className="w-40 h-28 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/post/${article.slug}`}>
                      <h3 className="text-base font-semibold text-neutral-900 mb-2 font-outfit cursor-pointer hover:text-gray-700 transition-colors">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface MostReadArticle {
  id: string;
  title: string;
  image?: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  hasImage: boolean;
  slug: string;
}

interface RightColumnThirdProps {
  mostReadArticles: MostReadArticle[];
}

export function RightColumnFifth({ mostReadArticles }: RightColumnThirdProps) {
  return (
    <div className="pl-6 pr-4">
      <div className="sticky top-6">
        {/* Most Read Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-sans">
              MOST READ
            </h2>
          </div>
          <div className="border-t border-black mb-4"></div>

          <div className="space-y-4">
            {mostReadArticles.map((article, index) => (
              <div
                key={article.id}
                className={
                  article.hasImage
                    ? "flex gap-3"
                    : "border-l-2 border-red-500 pl-3"
                }
              >
                {article.hasImage ? (
                  <>
                    <Link href={`/post/${article.slug}`}>
                      <Image
                        src={article.image || "/placeholder.svg"}
                        alt={article.imageAlt || "Article image"}
                        width={64}
                        height={64}
                        unoptimized={article.imageUnoptimized}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1">
                      <span className="text-blue-500 font-bold text-sm mr-2 font-sans">
                        {index + 1}
                      </span>
                      <Link href={`/post/${article.slug}`}>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight font-sans cursor-pointer hover:text-gray-700 transition-colors">
                          {article.title}
                        </h4>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-blue-500 font-bold text-sm mr-2 font-sans">
                      {index + 1}
                    </span>
                    <Link href={`/post/${article.slug}`}>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1 font-sans cursor-pointer hover:text-gray-700 transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-300 mb-6"></div>

        {/* Opinion Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-sans">
              Opinion
            </h2>
          </div>
          <div className="border-t border-gray-300 mb-4"></div>
          {(() => {
            const opinion =
              mostReadArticles && mostReadArticles.length > 0
                ? mostReadArticles[0]
                : undefined;
            const opinionHref = opinion ? `/post/${opinion.slug}` : "#";
            const opinionTitle = opinion ? opinion.title : "Opinion editorial";
            const opinionImage =
              opinion?.image ||
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop";
            const opinionAlt = opinion?.imageAlt || "Opinion image";
            return (
              <div className="p-2">
                <Link href={opinionHref}>
                  <Image
                    src={opinionImage}
                    alt={opinionAlt}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </Link>
                <Link href={opinionHref}>
                  <h3 className="mt-3 text-base font-semibold text-gray-900 leading-snug font-sans hover:text-gray-700 transition-colors">
                    {opinionTitle}
                  </h3>
                </Link>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

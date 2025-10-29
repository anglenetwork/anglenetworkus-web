import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface MostReadArticle {
  id: string;
  title: string;
  image?: string;
  imageAlt?: string;
  hasImage: boolean;
  slug: string;
}

interface RightColumnThirdProps {
  mostReadArticles: MostReadArticle[];
}

export function RightColumnThird({ mostReadArticles }: RightColumnThirdProps) {
  return (
    <div className="pl-6 pr-4">
      <div className="sticky top-6">
        {/* Most Read Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-outfit">
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
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1">
                      <span className="text-red-500 font-bold text-sm mr-2 font-outfit">
                        {index + 1}
                      </span>
                      <Link href={`/post/${article.slug}`}>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight font-outfit cursor-pointer hover:text-gray-700 transition-colors">
                          {article.title}
                        </h4>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-red-500 font-bold text-sm mr-2 font-outfit">
                      {index + 1}
                    </span>
                    <Link href={`/post/${article.slug}`}>
                      <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1 font-outfit cursor-pointer hover:text-gray-700 transition-colors">
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

        {/* Wuerker Section */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-outfit">
              WUERKER
            </h2>
          </div>
          <div className="border-t border-gray-300 mb-4"></div>
          <Card className="p-2">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop"
              alt="Political cartoon"
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-xl"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

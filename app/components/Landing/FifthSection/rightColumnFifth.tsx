import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "../../ui/section-header";

interface MostReadArticle {
  id: string;
  title: string;
  image?: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  imageSource?: string;
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
          <SectionHeader title="MOST READ" variant="gradient" />

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
                        className="w-16 h-16 object-cover rounded-sm flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 flex items-start gap-2">
                      <Link href={`/post/${article.slug}`} className="flex-1">
                        <h3 className="text-base font-sans font-normal text-neutral-900 leading-snug tracking-normal mb-2">
                          {article.title}
                        </h3>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-sm font-sans flex-shrink-0">
                      {index + 1}
                    </span>
                    <Link href={`/post/${article.slug}`} className="flex-1">
                      <h3 className="text-neutral-900 leading-normal mb-2 font-sans text-base font-normal tracking-wide">
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-300 mb-6"></div>
      </div>
    </div>
  );
}

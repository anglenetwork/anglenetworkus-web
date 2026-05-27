import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  fifthSectionMostReadTextTitle,
  fifthSectionMostReadWithThumbTitle,
} from "@/app/lib/typography/fifth-section";

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
    <div className="pr-4 pl-6">
      <div className="sticky top-6">
        {/* Most Read Section */}
        <div className="mb-8">
          <SectionHeader
            title="MOST READ"
            variant="light"
            accentStyle="geometric-square"
            size="large"
          />

          <div className="space-y-4">
            {mostReadArticles.map((article, index) => (
              <div
                key={article.id}
                className={
                  article.hasImage
                    ? "flex gap-3"
                    : "border-red-500 border-l-2 pl-3"
                }
              >
                {article.hasImage ? (
                  <>
                    <Link href={`/post/${article.slug}`}>
                      <ImageRenderer
                        src={article.image || "/placeholder.svg"}
                        alt={article.imageAlt || "Article image"}
                        width={64}
                        height={64}
                        unoptimized={article.imageUnoptimized}
                        className="h-16 w-16 flex-shrink-0 cursor-pointer rounded-sm object-cover transition-opacity hover:opacity-90"
                      />
                    </Link>
                    <div className="flex flex-1 items-start gap-2">
                      <Link href={`/post/${article.slug}`} className="flex-1">
                        <h3 className={fifthSectionMostReadWithThumbTitle}>
                          {article.title}
                        </h3>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 font-bold font-sans text-blue-500 text-sm">
                      {index + 1}
                    </span>
                    <Link href={`/post/${article.slug}`} className="flex-1">
                      <h3 className={fifthSectionMostReadTextTitle}>
                        {article.title}
                      </h3>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 border-gray-300 border-t"></div>
      </div>
    </div>
  );
}

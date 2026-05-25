import { Card } from "@/components/ui/card";
import { ImageRenderer } from "../../ui/image-renderer";

interface ArticleCardProps {
  category: string;
  title: string;
  description: string;
  author: string;
  image?: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  isDecorative?: boolean;
}

export default function ArticleCard({
  category,
  title,
  description,
  author,
  image,
  imageAlt,
  imageUnoptimized,
  isDecorative = false,
}: ArticleCardProps) {
  return (
    <Card className="h-[550px] w-80 min-w-[320px] flex-shrink-0 overflow-hidden rounded-none border-0 bg-gray-100 p-0 shadow-none">
      <div className="h-60 w-full flex-shrink-0 bg-gray-200">
        {isDecorative ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <div className="h-10 w-20 -skew-x-12 transform bg-red-600"></div>
          </div>
        ) : (
          <ImageRenderer
            src={image || "/placeholder.svg"}
            alt={imageAlt || "Article image"}
            width={400}
            height={240}
            unoptimized={imageUnoptimized}
            className="h-60 w-full rounded-sm object-cover object-center"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col bg-gray-100 p-2 text-center">
        <div className="mb-3 font-light font-sans text-red-600 text-sm tracking-wider">
          {category}
        </div>
        <h2 className="mb-3 font-bold font-sans text-2xl text-black leading-tight">
          {title}
        </h2>
        <p className="mb-4 font-normal font-sans text-gray-600 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}

import Image from "next/image";
import { Card } from "@/components/ui/card";

interface ArticleCardProps {
  category: string;
  title: string;
  description: string;
  author: string;
  image?: string;
  imageAlt?: string;
  isDecorative?: boolean;
}

export default function ArticleCard({
  category,
  title,
  description,
  author,
  image,
  imageAlt,
  isDecorative = false,
}: ArticleCardProps) {
  return (
    <Card className="border-0 shadow-none bg-gray-100 overflow-hidden h-[550px] w-80 min-w-[320px] flex-shrink-0 rounded-none p-0">
      <div className="w-full h-60 bg-gray-200 flex-shrink-0">
        {isDecorative ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="w-20 h-10 bg-red-600 transform -skew-x-12"></div>
          </div>
        ) : (
          <Image
            src={image || "/placeholder.svg"}
            alt={imageAlt || "Article image"}
            width={400}
            height={240}
            className="w-full h-60 object-cover object-center rounded-xl"
            style={{ width: "100%", height: "240px" }}
          />
        )}
      </div>

      <div className="p-2 flex flex-col text-center bg-gray-100 flex-1">
        <div className="text-red-600 text-sm font-light tracking-wider mb-3 font-outfit">
          {category}
        </div>
        <h2 className="text-black font-bold text-2xl leading-tight mb-3 font-outfit">
          {title}
        </h2>
        <p className="text-gray-600 font-normal text-xs leading-relaxed mb-4 font-outfit">
          {description}
        </p>
      </div>
    </Card>
  );
}

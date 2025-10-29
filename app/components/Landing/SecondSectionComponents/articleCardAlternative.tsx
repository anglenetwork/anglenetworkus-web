import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

interface ArticleCardAlternativeProps {
  category: string;
  title: string;
  description?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  isDecorative?: boolean;
  slug?: string;
  views7d?: number;
  readTime?: number;
}

export default function ArticleCardAlternative({
  category,
  title,
  description,
  author,
  image,
  imageAlt,
  isDecorative = false,
  slug = "#",
  views7d = 0,
  readTime = 5,
}: ArticleCardAlternativeProps) {
  return (
    <Link href={`/post/${slug}`} className="block">
      <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200">
        <div className="absolute inset-0">
          <Image
            src={image || "/placeholder.svg"}
            alt={imageAlt || title}
            fill
            className="object-cover rounded-xl"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
            <span className="text-xs font-inter font-medium uppercase tracking-wider">
              {category}
            </span>
          </div>

          <h3
            className="text-lg font-outfit font-semibold leading-tight mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>

          <div className="flex items-center gap-2">
            {/* <Play className="h-4 w-4 fill-white" /> */}
            <span className="text-xs font-outfit font-light">
              {readTime} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

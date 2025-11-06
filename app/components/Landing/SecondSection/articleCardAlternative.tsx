import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { SectionHeader } from "../../ui/section-header";

interface ArticleCardAlternativeProps {
  category: string;
  title: string;
  description?: string;
  author?: string;
  image?: string;
  imageAlt?: string;
  imageSource?: string;
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
  imageSource,
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
            className="object-cover rounded-sm"
          />
          {imageSource && (
            <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
              {imageSource}
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="mb-2 [&_span]:text-white">
            <SectionHeader title={category} variant="gradient" />
          </div>

          <h3
            className="leading-normal mb-2 font-sans text-lg line-clamp-2 font-medium tracking-wide"
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
            <span className="text-sm font-secondary font-light">
              {readTime} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

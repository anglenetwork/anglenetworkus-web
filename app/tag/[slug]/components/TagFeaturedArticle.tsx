import Link from "next/link";
import { FeaturedArticleBlock } from "@/app/components/ui/featured-article-block";

interface TagFeaturedArticleProps {
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
  href?: string;
  readTimeMinutes?: number | null;
}

export function TagFeaturedArticle({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  slug,
  href,
  readTimeMinutes,
}: TagFeaturedArticleProps) {
  return (
    <FeaturedArticleBlock
      image={image}
      imageAlt={imageAlt}
      imageUnoptimized={imageUnoptimized}
      title={title}
      href={href ?? `/post/${slug}`}
      readTimeMinutes={readTimeMinutes}
      priority
      titleAs="h1"
    />
  );
}

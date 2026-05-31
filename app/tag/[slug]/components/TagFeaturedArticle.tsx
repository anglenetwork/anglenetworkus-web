import Link from "next/link";
import { FeaturedArticleBlock } from "@/app/components/ui/featured-article-block";

interface TagFeaturedArticleProps {
  image: string;
  imageAlt: string;
  imageUnoptimized?: boolean;
  title: string;
  slug: string;
  href?: string;
  readTime?: string;
}

export function TagFeaturedArticle({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  slug,
  href,
  readTime,
}: TagFeaturedArticleProps) {
  return (
    <FeaturedArticleBlock
      image={image}
      imageAlt={imageAlt}
      imageUnoptimized={imageUnoptimized}
      title={title}
      href={href ?? `/post/${slug}`}
      readTime={readTime}
      priority
      titleAs="h1"
    />
  );
}

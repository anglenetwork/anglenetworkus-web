import { SecondaryArticleRow } from "@/app/components/ui/secondary-article-row";

interface TagNewsItemProps {
  image: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  title: string;
  readTime: string;
  slug: string;
  href?: string;
}

export function TagNewsItem({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  readTime,
  slug,
  href,
}: TagNewsItemProps) {
  return (
    <SecondaryArticleRow
      image={image}
      imageAlt={imageAlt}
      imageUnoptimized={imageUnoptimized}
      title={title}
      readTime={readTime}
      href={href ?? `/post/${slug}`}
    />
  );
}

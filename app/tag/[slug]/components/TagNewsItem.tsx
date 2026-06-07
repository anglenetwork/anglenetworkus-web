import { SecondaryArticleRow } from "@/app/components/ui/secondary-article-row";

interface TagNewsItemProps {
  image: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  title: string;
  readTimeMinutes?: number | null;
  slug: string;
  href?: string;
}

export function TagNewsItem({
  image,
  imageAlt,
  imageUnoptimized,
  title,
  readTimeMinutes,
  slug,
  href,
}: TagNewsItemProps) {
  return (
    <SecondaryArticleRow
      image={image}
      imageAlt={imageAlt}
      imageUnoptimized={imageUnoptimized}
      title={title}
      readTimeMinutes={readTimeMinutes}
      href={href ?? `/post/${slug}`}
    />
  );
}

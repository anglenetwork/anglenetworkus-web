import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import ArticleActions from "./ArticleActions";
import ArticleByline from "./ArticleByline";
import ArticleMedia from "./ArticleMedia";
import { portableTextComponents } from "./PortableTextComponents";
import type { PostBodyProps } from "./types";

export default function PostBody({
  sharePath,
  variant = "default",
  body,
  cover,
  imageGallery,
  title,
  author,
  date,
  updatedAt,
  slug,
  articleId,
}: PostBodyProps) {
  const shareUrl = sharePath ?? (slug ? `/post/${slug}` : "");
  const normalizedBody = Array.isArray(body) ? (body as PortableTextBlock[]) : [];

  if (variant === "editorial") {
    return (
      <div className="mb-8 text-left antialiased">
        <div className="mx-auto max-w-[860px]">
          <ArticleByline author={author} date={date} updatedAt={updatedAt} />

          <div className="mt-4">
            <ArticleActions
              articleId={articleId}
              slug={slug}
              title={title}
              shareUrl={shareUrl}
            />
          </div>

          <div className="mt-8 space-y-8 text-left">
            <ArticleMedia
              cover={cover}
              imageGallery={imageGallery}
              title={title}
              presentation="editorial"
            />

            <div className="font-body space-y-5 sm:space-y-6 text-left">
              <PortableText
                value={normalizedBody}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased text-left mb-8">
      <ArticleMedia cover={cover} imageGallery={imageGallery} title={title} />

      <div className="space-y-8 text-left">
        <div className="font-body space-y-5 sm:space-y-6 text-left">
          <PortableText value={normalizedBody} components={portableTextComponents} />
        </div>
      </div>
    </div>
  );
}

export type { PostBodyProps } from "./types";

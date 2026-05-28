import {
  NON_REGULAR_POST_BYLINE_ROW_CLASS,
  NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS,
  NON_REGULAR_POST_HERO_WIDTH_CLASS,
  NON_REGULAR_POST_MEDIA_SECTION_CLASS,
  REGULAR_POST_BODY_COLUMN_CLASS,
} from "./constants";
import { cn } from "@/lib/utils";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import ArticleActions from "./ArticleActions";
import ArticleByline from "./ArticleByline";
import ArticleMedia from "./ArticleMedia";
import PostSelectedNews from "../PostSelectedNews";
import {
  nonRegularPortableTextComponents,
  portableTextComponents,
} from "./PortableTextComponents";
import { splitBodyForInset } from "./split-body-for-inset";
import type { PostBodyProps } from "./types";

export default function PostBody({
  sharePath,
  variant = "default",
  mediaPresentation,
  body,
  cover,
  imageGallery,
  title,
  author,
  date,
  updatedAt,
  slug,
  articleId,
  insetPopularReads,
}: PostBodyProps) {
  const shareUrl = sharePath ?? (slug ? `/post/${slug}` : "");
  const normalizedBody = Array.isArray(body)
    ? (body as PortableTextBlock[])
    : [];
  const bodySplit = splitBodyForInset(normalizedBody);
  const shouldRenderPopularReadsInset =
    bodySplit.shouldInsert && Boolean(insetPopularReads?.length);
  const firstBodySlice = shouldRenderPopularReadsInset
    ? bodySplit.before
    : normalizedBody;
  const secondBodySlice = shouldRenderPopularReadsInset ? bodySplit.after : [];
  const popularReadsInset = shouldRenderPopularReadsInset ? (
    <aside
      className="my-8 lg:hidden"
      data-testid="in-body-popular-reads"
      aria-label="Popular Reads"
    >
      <PostSelectedNews
        latestNews={insetPopularReads ?? []}
        title="Popular Reads"
      />
    </aside>
  ) : null;

  const coverPresentation =
    mediaPresentation ?? (variant === "editorial" ? "editorial" : "default");
  const bodyComponents =
    variant === "editorial" || coverPresentation === "nonRegularCover"
      ? nonRegularPortableTextComponents
      : portableTextComponents;
  const useWideHero =
    variant === "editorial" || coverPresentation === "nonRegularCover";

  const articleMedia = (
    <ArticleMedia
      cover={cover}
      imageGallery={imageGallery}
      title={title}
      presentation={coverPresentation}
    />
  );

  if (variant === "editorial") {
    return (
      <div className="mb-8 text-left antialiased">
        <div className={NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS}>
          <div className={NON_REGULAR_POST_BYLINE_ROW_CLASS}>
            <ArticleByline
              author={author}
              date={date}
              updatedAt={updatedAt}
              layout="inline"
              showAvatar="xl"
            />
            <ArticleActions
              articleId={articleId}
              slug={slug}
              title={title}
              shareUrl={shareUrl}
            />
          </div>
        </div>

        <div
          className={cn(
            NON_REGULAR_POST_MEDIA_SECTION_CLASS,
            NON_REGULAR_POST_HERO_WIDTH_CLASS,
          )}
        >
          {articleMedia}
        </div>

        <div
          className={cn(
            NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS,
            "mt-8 space-y-8",
          )}
        >
          <div className={REGULAR_POST_BODY_COLUMN_CLASS}>
            <PortableText value={firstBodySlice} components={bodyComponents} />
            {popularReadsInset}
            {secondBodySlice.length > 0 && (
              <PortableText
                value={secondBodySlice}
                components={bodyComponents}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 text-left antialiased">
      {useWideHero ? (
        <div className={NON_REGULAR_POST_HERO_WIDTH_CLASS}>{articleMedia}</div>
      ) : (
        articleMedia
      )}

      <div className="space-y-8 text-left">
        <div className={REGULAR_POST_BODY_COLUMN_CLASS}>
          <PortableText value={firstBodySlice} components={bodyComponents} />
          {popularReadsInset}
          {secondBodySlice.length > 0 && (
            <PortableText value={secondBodySlice} components={bodyComponents} />
          )}
        </div>
      </div>
    </div>
  );
}

export type { PostBodyProps } from "./types";

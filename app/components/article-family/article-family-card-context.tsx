import type React from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { getCoverImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import {
  editorialKicker,
  typeLabel,
} from "@/app/lib/article-family/card-labels";
import {
  getArticleFamilyCardThumbLayout,
  type ArticleFamilyCardLayout,
} from "@/app/lib/article-family/card-thumb-layout";

type ArticleFamilyCardVariant = "default" | "search";

export type ArticleFamilyCardContext = {
  article: CardModel;
  layout: ArticleFamilyCardLayout;
  variant: ArticleFamilyCardVariant;
  kickerMode: "card" | "editorial";
  showDate: boolean;
  readTimeMinutes?: number;
  isSearchVariant: boolean;
  showPostTypeBadge: boolean;
  showAuthor: boolean;
  showExcerpt: boolean;
  hideExcerptOnMobile: boolean;
  hideAuthorOnMobile: boolean;
  hidePostTypeBadgeOnMobile: boolean;
  showTypeMetadataInCompact: boolean;
  label: string | null;
  imgUrl: string | null;
  coverData: ReturnType<typeof getCoverImage>;
  showAnalysisFocus: boolean | "" | null | undefined;
  sponsorName: string | undefined;
  dateStr: string;
  thumbLayout: ReturnType<typeof getArticleFamilyCardThumbLayout>;
  editorialK: string;
  thumbnail: React.ReactNode;
};

export function buildArticleFamilyCardContext({
  article,
  layout = "compact",
  variant = "default",
  kickerMode = "card",
  showDate = true,
  readTimeMinutes,
}: {
  article: CardModel;
  layout?: ArticleFamilyCardLayout;
  variant?: ArticleFamilyCardVariant;
  kickerMode?: "card" | "editorial";
  showDate?: boolean;
  readTimeMinutes?: number;
}): ArticleFamilyCardContext {
  const isSearchVariant = variant === "search";
  const showPostTypeBadge = isSearchVariant;
  const showAuthor = isSearchVariant;
  const showExcerpt = isSearchVariant;
  const hideExcerptOnMobile = isSearchVariant;
  const hideAuthorOnMobile = isSearchVariant;
  const hidePostTypeBadgeOnMobile = isSearchVariant;
  const showTypeMetadataInCompact = isSearchVariant;
  const label = typeLabel(article._type, showPostTypeBadge);

  const thumbLayout = getArticleFamilyCardThumbLayout(layout, isSearchVariant);

  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article",
    thumbLayout.imgMaxW,
  );
  const imgUrl = coverData?.src ?? null;
  const showAnalysisFocus =
    article.analysisFocus &&
    (layout === "large" || (showTypeMetadataInCompact && layout === "compact"));
  const sponsorName = article.sponsorAttribution?.sponsorName;

  let dateStr = "";
  try {
    if (article.publishedAt) {
      dateStr = format(parseISO(article.publishedAt), "MMM dd, h:mm a");
    }
  } catch {
    dateStr = "";
  }

  const editorialK = editorialKicker(article, label);

  const thumbnail = imgUrl ? (
    <div className={thumbLayout.thumbWrap}>
      <ImageRenderer
        src={imgUrl}
        alt={coverData?.alt || article.title || "Article image"}
        unoptimized={coverData?.unoptimized}
        className="object-cover object-center transition-opacity duration-200"
        width={thumbLayout.thumbImageWidth}
        height={thumbLayout.thumbImageHeight}
        quality={50}
        sizes={thumbLayout.thumbSizes}
        fill
      />
    </div>
  ) : (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg bg-gray-200/80 font-sans text-[10px] text-gray-500",
        thumbLayout.placeholderClass,
      )}
    >
      No Image
    </div>
  );

  return {
    article,
    layout,
    variant,
    kickerMode,
    showDate,
    readTimeMinutes,
    isSearchVariant,
    showPostTypeBadge,
    showAuthor,
    showExcerpt,
    hideExcerptOnMobile,
    hideAuthorOnMobile,
    hidePostTypeBadgeOnMobile,
    showTypeMetadataInCompact,
    label,
    imgUrl,
    coverData,
    showAnalysisFocus,
    sponsorName,
    dateStr,
    thumbLayout,
    editorialK,
    thumbnail,
  };
}

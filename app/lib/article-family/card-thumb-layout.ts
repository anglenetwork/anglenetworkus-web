import {
  articleFamilyCardTitle,
  articleFamilyCardTitleRail,
} from "@/app/lib/typography/article-family-card";
import { searchResultTitle } from "@/app/lib/typography/search-page";

export type ArticleFamilyCardLayout = "compact" | "large" | "rail" | "heroTile";

export function getArticleFamilyCardThumbLayout(
  layout: ArticleFamilyCardLayout,
  isSearchVariant: boolean,
) {
  const enlargeMobileThumb = isSearchVariant;

  const imgMaxW =
    layout === "large"
      ? 400
      : layout === "rail"
        ? 180
        : layout === "heroTile"
          ? 600
          : 450;

  const thumbWrap =
    layout === "rail"
      ? "relative h-[72px] w-24 flex-shrink-0 overflow-hidden rounded-[4px]"
      : enlargeMobileThumb
        ? "relative h-[92px] w-[115px] flex-shrink-0 overflow-hidden rounded-lg md:h-[174px] md:w-[216px]"
        : "relative h-[77px] w-24 flex-shrink-0 overflow-hidden rounded-lg md:h-[174px] md:w-[216px]";

  const thumbImageWidth = layout === "rail" ? 96 : 216;
  const thumbImageHeight = layout === "rail" ? 72 : 174;

  const thumbSizes =
    layout === "rail"
      ? "96px"
      : enlargeMobileThumb
        ? "(max-width: 768px) 115px, 216px"
        : "(max-width: 768px) 96px, 216px";

  const linkGap = layout === "rail" ? "gap-3" : "gap-4";

  const titleClass = isSearchVariant
    ? searchResultTitle
    : layout === "rail"
      ? articleFamilyCardTitleRail
      : articleFamilyCardTitle;

  const placeholderClass =
    layout === "rail"
      ? "h-[72px] w-24 rounded-[4px]"
      : enlargeMobileThumb
        ? "h-[92px] w-[115px] md:h-[174px] md:w-[216px]"
        : "h-[77px] w-24 md:h-[174px] md:w-[216px]";

  return {
    imgMaxW,
    thumbWrap,
    thumbImageWidth,
    thumbImageHeight,
    thumbSizes,
    linkGap,
    titleClass,
    placeholderClass,
    enlargeMobileThumb,
  };
}

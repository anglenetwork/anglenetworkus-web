import {
  ARTICLE_IMAGE_EPIGRAPH_CLASS,
  ARTICLE_IMAGE_EPIGRAPH_CREDIT_CLASS,
} from "./constants";

interface ArticleCaptionProps {
  caption?: string | null;
  credit?: string | null;
  license?: string | null;
  alt?: string | null;
  showAltAsCaption?: boolean;
  fallbackCaption?: string;
  figcaptionClassName?: string;
}

function captionCreditSeparator(caption: string): string {
  return /[.!?]$/.test(caption) ? " " : ". ";
}

export default function ArticleCaption({
  caption,
  credit,
  license,
  alt,
  showAltAsCaption = false,
  fallbackCaption,
  figcaptionClassName = "mt-2 text-left",
}: ArticleCaptionProps) {
  const displayCaption = (caption || fallbackCaption)?.trim() || null;
  const displayCredit = credit?.trim() || null;
  const displayLicense = license?.trim() || null;
  const showPrimaryLine = Boolean(
    displayCaption || displayCredit || displayLicense,
  );
  const showAltLine = Boolean(showAltAsCaption && alt);
  const hasLeadingEpigraph = Boolean(displayCaption || displayCredit);

  if (!showPrimaryLine && !showAltLine) return null;

  return (
    <figcaption className={figcaptionClassName}>
      {showPrimaryLine && (
        <p className="leading-snug">
          {displayCaption && (
            <span className={ARTICLE_IMAGE_EPIGRAPH_CLASS}>
              {displayCaption}
            </span>
          )}
          {displayCaption && displayCredit && (
            <span className={ARTICLE_IMAGE_EPIGRAPH_CLASS}>
              {captionCreditSeparator(displayCaption)}
            </span>
          )}
          {displayCredit && (
            <span className={ARTICLE_IMAGE_EPIGRAPH_CREDIT_CLASS}>
              {displayCredit}
            </span>
          )}
          {displayLicense && (
            <span className={ARTICLE_IMAGE_EPIGRAPH_CREDIT_CLASS}>
              {hasLeadingEpigraph ? " " : ""}({displayLicense})
            </span>
          )}
        </p>
      )}
      {showAltLine && (
        <p
          className="font-sans text-[12px] text-news-muted sm:text-xs"
          aria-hidden="true"
        >
          {alt}
        </p>
      )}
    </figcaption>
  );
}

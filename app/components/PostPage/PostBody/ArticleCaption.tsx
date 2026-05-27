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
}: ArticleCaptionProps) {
  const displayCaption = (caption || fallbackCaption)?.trim() || null;
  const displayCredit = credit?.trim() || null;
  const displayLicense = license?.trim() || null;
  const showPrimaryLine = Boolean(displayCaption || displayCredit);
  const showAltLine = Boolean(showAltAsCaption && alt);

  if (!showPrimaryLine && !showAltLine && !displayLicense) return null;

  return (
    <figcaption className="mt-2 text-left">
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
        </p>
      )}
      {showAltLine && (
        <p
          className="font-sans text-[12px] text-neutral-400 sm:text-xs"
          aria-hidden="true"
        >
          {alt}
        </p>
      )}
      {displayLicense && (
        <p className="mt-1 font-sans text-neutral-500 text-xs">
          {displayLicense}
        </p>
      )}
    </figcaption>
  );
}

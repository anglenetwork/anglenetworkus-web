import {
  ARTICLE_META_PRIMARY_CLASS,
  ARTICLE_META_SECONDARY_CLASS,
} from "./constants";

interface ArticleCaptionProps {
  epigraph?: string | null;
  credit?: string | null;
  alt?: string | null;
  showAltAsCaption?: boolean;
  fallbackEpigraph?: string;
}

export default function ArticleCaption({
  epigraph,
  credit,
  alt,
  showAltAsCaption = false,
  fallbackEpigraph,
}: ArticleCaptionProps) {
  const displayEpigraph = epigraph || fallbackEpigraph;
  const showPrimaryLine = Boolean(displayEpigraph || credit);
  const showAltLine = Boolean(showAltAsCaption && alt);

  if (!showPrimaryLine && !showAltLine) return null;

  return (
    <figcaption className="mt-2 text-left">
      {showPrimaryLine && (
        <p className="leading-snug">
          {displayEpigraph && (
            <span className={ARTICLE_META_PRIMARY_CLASS}>{displayEpigraph}</span>
          )}
          {displayEpigraph && credit && (
            <span className="text-neutral-400"> • </span>
          )}
          {credit && (
            <span className={ARTICLE_META_SECONDARY_CLASS}>{credit}</span>
          )}
        </p>
      )}
      {showAltLine && (
        <p
          className="font-sans text-[12px] sm:text-xs text-neutral-400"
          aria-hidden="true"
        >
          {alt}
        </p>
      )}
    </figcaption>
  );
}

import { cn } from "@/lib/utils";

export type ExcerptCreditCaptionProps = {
  excerpt?: string | null;
  credit?: string | null;
  /** Merged onto the outer `<p>` (e.g. spacing overrides). */
  className?: string;
};

/**
 * One line under an image: optional excerpt (dek) and optional photo credit.
 * When both exist they appear as `excerpt - credit` with light typographic split.
 */
export function ExcerptCreditCaption({
  excerpt,
  credit,
  className,
}: ExcerptCreditCaptionProps) {
  const excerptText = (excerpt ?? "").trim();
  const creditText = (credit ?? "").trim();

  if (!excerptText && !creditText) {
    return null;
  }

  return (
    <p
      className={cn(
        "mt-3 text-sm font-sans leading-relaxed text-neutral-600 md:text-base",
        className,
      )}
    >
      {excerptText ? (
        <span className="font-normal tracking-normal">{excerptText}</span>
      ) : null}
      {excerptText && creditText ? (
        <span className="text-neutral-500"> - </span>
      ) : null}
      {creditText ? (
        <span className="text-sm text-gray-500">{creditText}</span>
      ) : null}
    </p>
  );
}

import { cn } from "@/lib/utils";

export type ExcerptCreditCaptionProps = {
  excerpt?: string | null;
  credit?: string | null;
  /** Merged onto the outer `<p>` (e.g. spacing overrides). */
  className?: string;
  align?: "left" | "right";
  variant?: "default" | "compact";
};

/**
 * One line under an image: optional excerpt (dek) and optional photo credit.
 * When both exist they appear as `excerpt - credit` with light typographic split.
 */
export function ExcerptCreditCaption({
  excerpt,
  credit,
  className,
  align = "left",
  variant = "default",
}: ExcerptCreditCaptionProps) {
  const excerptText = (excerpt ?? "").trim();
  const creditText = (credit ?? "").trim();

  if (!excerptText && !creditText) {
    return null;
  }

  const isCompact = variant === "compact";

  return (
    <p
      className={cn(
        isCompact
          ? "mt-1 font-sans text-[10px] text-news-muted"
          : "mt-3 font-sans text-news-muted text-sm leading-relaxed md:text-base",
        align === "right" && "text-right",
        className,
      )}
    >
      {excerptText ? (
        <span className="font-normal tracking-normal">{excerptText}</span>
      ) : null}
      {excerptText && creditText ? (
        <span className={isCompact ? "text-news-muted" : "text-news-muted"}>
          {" "}
          -{" "}
        </span>
      ) : null}
      {creditText ? (
        <span className={isCompact ? "" : "text-news-muted text-sm"}>
          {creditText}
        </span>
      ) : null}
    </p>
  );
}

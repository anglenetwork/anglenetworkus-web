export type ReadTimeLabelVariant =
  | "default"
  | "news"
  | "dark"
  | "accent"
  | "muted"
  | "inline"
  | "hero"
  | "angle";

const readTimeLabelVariants: Record<ReadTimeLabelVariant, string> = {
  default:
    "mt-2 font-sans font-normal text-neutral-500 text-xs uppercase tracking-wide",
  news: "mt-2 font-sans font-normal text-news-muted text-xs uppercase tracking-wide",
  dark: "mt-2 font-sans font-medium text-neutral-400 text-xs uppercase tracking-wide",
  accent:
    "font-sans text-xs font-normal text-news-primary leading-none uppercase",
  muted:
    "mt-3 font-sans font-semibold text-muted-foreground text-xs uppercase tracking-wide",
  inline: "font-sans text-neutral-400 text-xs",
  hero: "font-normal font-sans text-xs text-white",
  angle: "mt-2 font-mono text-[11px] text-angle-inkSoft",
};

export function formatReadTimeLabel(minutes?: number | null): string {
  return `${minutes || 3} MIN READ`;
}

export function readTimeLabelClassName(
  variant: ReadTimeLabelVariant = "default",
): string {
  return readTimeLabelVariants[variant];
}

export function resolveReadTimeLabelVariant(
  variant: ReadTimeLabelVariant | "light" | "news" = "default",
): ReadTimeLabelVariant {
  if (variant === "light") return "default";
  return variant;
}

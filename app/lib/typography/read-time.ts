export type ReadTimeLabelVariant =
  | "default"
  | "dark"
  | "accent"
  | "muted"
  | "inline"
  | "hero";

const readTimeLabelVariants: Record<ReadTimeLabelVariant, string> = {
  default:
    "mt-2 font-sans font-normal text-neutral-500 text-xs uppercase tracking-wide",
  dark: "mt-2 font-sans font-medium text-neutral-400 text-xs uppercase tracking-wide",
  accent: "font-sans text-xs font-normal text-red-600 leading-none uppercase",
  muted:
    "mt-3 font-sans font-semibold text-muted-foreground text-xs uppercase tracking-wide",
  inline: "font-sans text-neutral-400 text-xs",
  hero: "font-light font-sans text-xs text-white",
};

/** @deprecated Use `readTimeLabelClassName("default")` or `ReadTimeLabel`. */
export const tagReadTimeLabel = readTimeLabelVariants.default;

export function formatReadTimeLabel(minutes?: number | null): string {
  return `${minutes || 3} MIN READ`;
}

export function readTimeLabelClassName(
  variant: ReadTimeLabelVariant = "default",
): string {
  return readTimeLabelVariants[variant];
}

export function resolveReadTimeLabelVariant(
  variant: ReadTimeLabelVariant | "light" = "default",
): ReadTimeLabelVariant {
  return variant === "light" ? "default" : variant;
}

import Link from "next/link";
import { sectionHeaderLink } from "@/app/lib/typography/article-links";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  variant?: "light" | "dark";
  size?: "regular" | "large";
  accentStyle?:
    | "red-gradient"
    | "geometric-square"
    | "small-dot"
    | "gradient-fade";
}

interface SectionHeaderAccentProps {
  accentStyle: SectionHeaderProps["accentStyle"];
  variant: SectionHeaderProps["variant"];
}

function SectionHeaderAccent({
  accentStyle = "gradient-fade",
  variant = "light",
}: SectionHeaderAccentProps) {
  switch (accentStyle) {
    case "geometric-square":
      return <div className="size-2 bg-red-600 dark:bg-slate-100" />;
    case "small-dot":
      return (
        <span
          className={`size-1.5 shrink-0 ${
            variant === "dark" ? "bg-white" : "bg-neutral-900"
          }`}
          aria-hidden
        />
      );
    case "red-gradient":
      return (
        <div className="h-0.5 w-full bg-gradient-to-r from-red-600 to-transparent" />
      );
    case "gradient-fade":
    default:
      return (
        <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-slate-900/0 dark:from-slate-100 dark:to-slate-100/0" />
      );
  }
}

export function SectionHeader({
  title,
  subtitle,
  href,
  variant = "light",
  size = "regular",
  accentStyle = "gradient-fade",
}: SectionHeaderProps) {
  const textColor = variant === "dark" ? "text-white" : "text-foreground";
  const fontSize = size === "large" ? "text-lg" : "text-sm";
  const linkedTitleClass = href ? sectionHeaderLink : undefined;
  const linkWrapperClass = cn(
    "group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2",
    href && "cursor-pointer",
  );

  const isInlineAccent =
    accentStyle === "geometric-square" || accentStyle === "small-dot";

  if (isInlineAccent) {
    const titleTracking =
      accentStyle === "small-dot" ? "tracking-normal" : "tracking-wide";
    const rowGap = accentStyle === "small-dot" ? "gap-2" : "gap-3";

    const content = (
      <div className="mb-6 flex w-full flex-col items-start gap-3">
        <div className={`flex items-center ${rowGap}`}>
          <SectionHeaderAccent accentStyle={accentStyle} variant={variant} />
          <h2
            className={cn(
              fontSize,
              "font-bold font-sans uppercase",
              titleTracking,
              textColor,
              linkedTitleClass,
            )}
          >
            {title}
          </h2>
        </div>
      </div>
    );

    if (href) {
      return (
        <Link href={href} className={linkWrapperClass}>
          {content}
        </Link>
      );
    }
    return content;
  }

  // Default container className
  const containerClassName =
    accentStyle === "gradient-fade"
      ? "flex flex-col items-start gap-3 w-full mb-6"
      : "flex flex-col items-start gap-1.5 w-full mb-6";

  const content = (
    <div className={containerClassName}>
      <h2
        className={cn(
          fontSize,
          "font-bold font-sans uppercase tracking-normal",
          textColor,
          linkedTitleClass,
        )}
      >
        {title}
      </h2>
      <SectionHeaderAccent accentStyle={accentStyle} variant={variant} />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={linkWrapperClass}>
        {content}
      </Link>
    );
  }

  return content;
}

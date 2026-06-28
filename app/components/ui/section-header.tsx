import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, CircleSmall } from "lucide-react";
import { sectionHeaderLink } from "@/app/lib/typography/article-links";
import {
  minimalSectionTitle,
  modernSectionTitle,
  modernSectionTitleLarge,
  smallDotSectionTitle,
  smallDotSectionTitleLarge,
} from "@/app/lib/typography/section-header";
import { cn } from "@/lib/utils";

const sectionHeaderIcons = {
  "circle-small": CircleSmall,
  "arrow-up-right": ArrowUpRight,
} as const;

type SectionHeaderIcon = keyof typeof sectionHeaderIcons;

interface SectionHeaderProps {
  title: string;
  href?: string;
  variant?: "light" | "news" | "dark";
  size?: "regular" | "large";
  accentStyle?: "small-dot" | "modern" | "minimal";
  /** Default: circle-small. Pass `false` to hide the icon (small-dot uses its dot fallback). */
  icon?: SectionHeaderIcon | false;
}

function SectionHeaderIconElement({
  icon,
  variant,
}: {
  icon: SectionHeaderIcon;
  variant: "light" | "news" | "dark";
}) {
  const Icon = sectionHeaderIcons[icon];

  return (
    <Icon
      className={cn(
        "size-3.5 shrink-0",
        icon === "circle-small"
          ? "text-red-600"
          : variant === "dark"
            ? "text-white"
            : variant === "news"
              ? "text-news-text"
              : "text-neutral-900",
      )}
      strokeWidth={3}
      aria-hidden
    />
  );
}

function SectionHeaderLinkWrapper({
  href,
  variant,
  marginClass,
  children,
}: {
  href: string;
  variant: "light" | "news" | "dark";
  marginClass: string;
  children: ReactNode;
}) {
  return (
    <div className={marginClass}>
      <Link
        href={href}
        className={cn(
          "group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          variant === "news"
            ? "focus-visible:outline-news-primary"
            : "focus-visible:outline-red-600",
        )}
      >
        {children}
      </Link>
    </div>
  );
}

export function SectionHeader({
  title,
  href,
  variant = "light",
  size = "regular",
  accentStyle = "modern",
  icon = "circle-small",
}: SectionHeaderProps) {
  const showIcon = icon !== false;
  const resolvedIcon = icon === false ? "circle-small" : icon;

  if (accentStyle === "modern") {
    const titleClass =
      size === "large"
        ? modernSectionTitleLarge[variant]
        : modernSectionTitle[variant];
    const titleEl = (
      <div className={cn("flex items-center", showIcon && "gap-2")}>
        {showIcon && (
          <SectionHeaderIconElement icon={resolvedIcon} variant={variant} />
        )}
        <h2 className={cn(titleClass, href && sectionHeaderLink)}>{title}</h2>
      </div>
    );

    if (href) {
      return (
        <SectionHeaderLinkWrapper
          href={href}
          variant={variant}
          marginClass="mb-8"
        >
          {titleEl}
        </SectionHeaderLinkWrapper>
      );
    }

    return <div className="mb-8">{titleEl}</div>;
  }

  if (accentStyle === "minimal") {
    const titleEl = (
      <div className={cn("flex items-center", showIcon && "gap-2")}>
        {showIcon && (
          <SectionHeaderIconElement icon={resolvedIcon} variant={variant} />
        )}
        <h2
          className={cn(
            minimalSectionTitle[variant],
            href && sectionHeaderLink,
          )}
        >
          {title}
        </h2>
      </div>
    );

    if (href) {
      return (
        <SectionHeaderLinkWrapper
          href={href}
          variant={variant}
          marginClass="mb-6"
        >
          {titleEl}
        </SectionHeaderLinkWrapper>
      );
    }

    return <div className="mb-6">{titleEl}</div>;
  }

  const titleClass =
    size === "large"
      ? smallDotSectionTitleLarge[variant]
      : smallDotSectionTitle[variant];
  const linkWrapperClass = cn(
    "group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variant === "news"
      ? "focus-visible:outline-news-primary"
      : "focus-visible:outline-red-600",
    href && "cursor-pointer",
  );

  const content = (
    <div className="mb-6 flex w-full flex-col items-start gap-3">
      <div className="flex items-center gap-2">
        {showIcon ? (
          <SectionHeaderIconElement icon={resolvedIcon} variant={variant} />
        ) : (
          <span
            className={cn(
              "size-1.5 shrink-0",
              variant === "dark"
                ? "bg-white"
                : variant === "news"
                  ? "bg-news-text"
                  : "bg-neutral-900",
            )}
            aria-hidden
          />
        )}
        <h2 className={cn(titleClass, href && sectionHeaderLink)}>{title}</h2>
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

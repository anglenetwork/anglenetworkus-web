import Link from "next/link";
import { sectionHeaderLink } from "@/app/lib/typography/article-links";
import {
  modernSectionTitle,
  smallDotSectionTitle,
  smallDotSectionTitleLarge,
} from "@/app/lib/typography/section-header";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  variant?: "light" | "dark";
  size?: "regular" | "large";
  accentStyle?: "small-dot" | "modern";
}

export function SectionHeader({
  title,
  href,
  variant = "light",
  size = "regular",
  accentStyle = "modern",
}: SectionHeaderProps) {
  if (accentStyle === "modern") {
    const titleEl = (
      <h2
        className={cn(modernSectionTitle[variant], href && sectionHeaderLink)}
      >
        {title}
      </h2>
    );

    if (href) {
      return (
        <div className="mb-8">
          <Link
            href={href}
            className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2"
          >
            {titleEl}
          </Link>
        </div>
      );
    }

    return <div className="mb-8">{titleEl}</div>;
  }

  const titleClass =
    size === "large"
      ? smallDotSectionTitleLarge[variant]
      : smallDotSectionTitle[variant];
  const linkWrapperClass = cn(
    "group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2",
    href && "cursor-pointer",
  );

  const content = (
    <div className="mb-6 flex w-full flex-col items-start gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`size-1.5 shrink-0 ${
            variant === "dark" ? "bg-white" : "bg-neutral-900"
          }`}
          aria-hidden
        />
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

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { sectionHeaderLink } from "@/app/lib/typography/article-links";
import {
  modernSectionMoreLink,
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
    return (
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className={modernSectionTitle[variant]}>{title}</h2>
        {href ? (
          <Link
            href={href}
            className="group flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2"
          >
            <span className={modernSectionMoreLink[variant]}>More {title}</span>
            <span
              className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white"
              aria-hidden
            >
              <ChevronRight className="size-3.5 stroke-[2.5]" />
            </span>
          </Link>
        ) : null}
      </div>
    );
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

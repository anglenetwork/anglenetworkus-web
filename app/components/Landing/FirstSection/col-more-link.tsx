import Link from "next/link";
import { colMoreLabel } from "@/app/lib/typography/first-section";

interface ColMoreLinkProps {
  href: string;
  label: string;
}

/** "More {Category} news" / "More headlines" link pinned to the bottom of a Front section column. */
export function ColMoreLink({ href, label }: ColMoreLinkProps) {
  return (
    <Link href={href} className="group mt-auto flex items-center gap-2.5 pt-6">
      <span className={colMoreLabel}>{label}</span>
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-angle-red">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={3}
          className="size-2.5"
          aria-hidden
        >
          <line x1="6" y1="18" x2="18" y2="6" />
          <polyline points="9 6 18 6 18 15" />
        </svg>
      </span>
    </Link>
  );
}

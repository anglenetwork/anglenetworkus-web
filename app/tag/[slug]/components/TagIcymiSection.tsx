import Link from "next/link";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import {
  tagIcymiCredit,
  tagIcymiHeadline,
  tagIcymiHeading,
  tagIcymiImageFrame,
  tagIcymiItemNumber,
  tagIcymiReadTime,
  TAG_ICYMI_DESKTOP_IMAGE_SIZE,
  TAG_ICYMI_IMAGE_SIZES,
  TAG_ICYMI_MOBILE_IMAGE_SIZE,
} from "@/app/lib/typography/tag-page";
import type { TagIcymiItem } from "./types";

interface TagIcymiSectionProps {
  items: TagIcymiItem[];
}

function TagIcymiHeading() {
  return (
    <div className="flex items-baseline gap-[18px]">
      <div className="flex items-center gap-[9px]">
        <Circle
          className="size-[13px] shrink-0 text-news-primary"
          strokeWidth={2.5}
          aria-hidden
        />
        <h2 className={tagIcymiHeading}>In case you missed it</h2>
      </div>
      <div className="h-px flex-1 bg-news-border" />
    </div>
  );
}

function icymiColumnClassName() {
  return "min-w-0 py-6 lg:px-8 lg:pt-7 lg:pb-0";
}

function TagIcymiMobileRow({ item }: { item: TagIcymiItem }) {
  return (
    <Link
      href={item.href}
      className="group flex items-start gap-3"
      aria-label={`Read article: ${item.title}`}
    >
      <div className="relative size-20 shrink-0 overflow-hidden bg-news-secondary">
        <ImageRenderer
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.imageAlt?.trim() || item.title}
          width={TAG_ICYMI_MOBILE_IMAGE_SIZE}
          height={TAG_ICYMI_MOBILE_IMAGE_SIZE}
          fill
          sizes={`${TAG_ICYMI_MOBILE_IMAGE_SIZE}px`}
          unoptimized={item.imageUnoptimized}
          className="object-cover object-center"
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className={cn(tagIcymiItemNumber, "mb-2")}>{item.number}</span>
        <h3 className={cn(tagIcymiHeadline, "group-hover:text-news-muted")}>
          {item.title}
        </h3>
        <ReadTimeLabel
          minutes={item.readTimeMinutes}
          variant="news"
          className={cn(tagIcymiReadTime, "mt-3")}
        />
      </div>
    </Link>
  );
}

function TagIcymiDesktopColumn({ item }: { item: TagIcymiItem }) {
  return (
    <>
      <span className={tagIcymiItemNumber}>{item.number}</span>
      <Link
        href={item.href}
        className="group block w-full min-w-0"
        aria-label={`Read article: ${item.title}`}
      >
        <div className={tagIcymiImageFrame}>
          <ImageRenderer
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.imageAlt?.trim() || item.title}
            width={TAG_ICYMI_DESKTOP_IMAGE_SIZE}
            height={TAG_ICYMI_DESKTOP_IMAGE_SIZE}
            fill
            sizes={TAG_ICYMI_IMAGE_SIZES}
            unoptimized={item.imageUnoptimized}
            className="object-cover object-center"
          />
        </div>
      </Link>
      {item.imageCredit ? (
        <p className={tagIcymiCredit}>{item.imageCredit}</p>
      ) : null}
      <Link href={item.href} className="group block">
        <h3
          className={cn(
            "mt-[18px] mb-3",
            tagIcymiHeadline,
            "group-hover:text-news-muted",
          )}
        >
          {item.title}
        </h3>
      </Link>
      <ReadTimeLabel
        minutes={item.readTimeMinutes}
        variant="news"
        className={cn(tagIcymiReadTime, "mt-0")}
      />
    </>
  );
}

export function TagIcymiSection({ items }: TagIcymiSectionProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label="In case you missed it" className="bg-news-surface">
      <SitePageWidth className="pt-8 pb-8">
        <TagIcymiHeading />
        <div
          aria-label="In case you missed it articles"
          className="mt-4 grid grid-cols-1 divide-y divide-news-border border-news-border lg:grid-cols-4 lg:divide-x lg:divide-y-0"
        >
          {items.map((item) => (
            <article key={item.id} className={icymiColumnClassName()}>
              <div className="lg:hidden">
                <TagIcymiMobileRow item={item} />
              </div>
              <div className="hidden lg:block">
                <TagIcymiDesktopColumn item={item} />
              </div>
            </article>
          ))}
        </div>
      </SitePageWidth>
    </section>
  );
}

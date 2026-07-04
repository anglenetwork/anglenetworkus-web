import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { formatSectionDate } from "@/app/lib/format-section-date";
import {
  tagPageDateMeta,
  tagPageTitle,
} from "@/app/lib/typography/tag-page";

interface TagPageHeaderProps {
  tagTitle: string;
}

export function TagPageHeader({ tagTitle }: TagPageHeaderProps) {
  return (
    <header className="border-news-text border-b bg-news-surface">
      <SitePageWidth className="flex flex-col gap-4 py-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 items-end gap-5 max-xl:flex-col max-xl:items-start max-xl:gap-3.5">
          <div
            className="w-1.5 shrink-0 self-stretch bg-news-primary max-xl:h-1 max-xl:w-full max-xl:self-auto"
            aria-hidden
          />
          <h1 className={tagPageTitle}>{tagTitle}</h1>
        </div>
        <p className={tagPageDateMeta}>{formatSectionDate(new Date())}</p>
      </SitePageWidth>
    </header>
  );
}

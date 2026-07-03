import { SitePageWidth } from "@/app/components/layout/site-page-width";

interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription?: string;
}

/** e.g. "THURSDAY, JULY 2, 2026" */
function formatSectionDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function CategoryHeader({
  categoryName,
  categoryDescription,
}: CategoryHeaderProps) {
  return (
    <header className="border-news-text border-b bg-news-surface">
      <SitePageWidth className="flex flex-col gap-4 pt-10 pb-7 md:flex-row md:items-baseline md:justify-between md:gap-6 md:pt-12 md:pb-7 xl:pt-10">
        <h1 className="font-bold font-display text-5xl text-news-text capitalize leading-none tracking-tight md:text-7xl">
          {categoryName}
        </h1>
        <p className="font-sans text-news-muted text-xs uppercase tracking-wide">
          {formatSectionDate(new Date())}
        </p>
      </SitePageWidth>
    </header>
  );
}

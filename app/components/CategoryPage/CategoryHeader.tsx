import { SitePageWidth } from "@/app/components/layout/site-page-width";

interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription?: string;
}

export function CategoryHeader({
  categoryName,
  categoryDescription,
}: CategoryHeaderProps) {
  return (
    <header className="border-news-border border-b bg-news-surface">
      <SitePageWidth className="py-4">
        <div className="">
          <h1 className="text-center font-bold font-display text-4xl text-news-text capitalize md:text-5xl lg:text-6xl">
            {categoryName}
          </h1>
        </div>
      </SitePageWidth>
    </header>
  );
}

import Link from "next/link";
import ArticleFamilyCard from "./ArticleFamilyCard";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

const PAGE_SIZE = 10;

type ArticleFamilyIndexPageProps = {
  title: string;
  description?: string;
  articles: CardModel[];
  page: number;
  total: number;
  basePath: string;
};

function pageHref(basePath: string, pageNum: number): string {
  if (pageNum <= 1) return basePath;
  const q = new URLSearchParams({ page: String(pageNum) });
  return `${basePath}?${q.toString()}`;
}

export default function ArticleFamilyIndexPage({
  title,
  description,
  articles,
  page,
  total,
  basePath,
}: ArticleFamilyIndexPageProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startItem = total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, total);

  return (
    <SitePageWidth variant="narrow" className="py-10 md:py-14">
      <header className="mb-10 border-neutral-200 border-b pb-6">
        <h1 className="font-bold font-sans text-3xl text-neutral-900 md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 font-sans text-neutral-600 text-sm md:text-base">
            {description}
          </p>
        ) : null}
        {total > 0 ? (
          <p className="mt-3 font-sans text-neutral-500 text-xs">
            Showing {startItem}–{endItem} of {total}
          </p>
        ) : null}
      </header>

      {articles.length === 0 ? (
        <p className="py-12 text-center font-sans text-neutral-600">
          No articles yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article, i) => (
            <ArticleFamilyCard
              key={article._id}
              article={article}
              layout={i === 0 && safePage === 1 ? "large" : "compact"}
            />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          aria-label="Pagination"
        >
          <Link
            href={pageHref(basePath, safePage - 1)}
            className={`rounded-lg border border-neutral-300 px-4 py-2 font-sans text-sm ${
              safePage <= 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-neutral-50"
            }`}
            aria-disabled={safePage <= 1}
          >
            Previous
          </Link>
          <span className="font-sans text-neutral-600 text-sm">
            Page {safePage} of {totalPages}
          </span>
          <Link
            href={pageHref(basePath, safePage + 1)}
            className={`rounded-lg border border-neutral-300 px-4 py-2 font-sans text-sm ${
              safePage >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-neutral-50"
            }`}
            aria-disabled={safePage >= totalPages}
          >
            Next
          </Link>
        </nav>
      ) : null}
    </SitePageWidth>
  );
}

export { PAGE_SIZE as articleFamilyIndexPageSize };

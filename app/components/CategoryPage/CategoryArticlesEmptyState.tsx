import Link from "next/link";

export function CategoryArticlesEmptyState({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <div className="py-12 text-center">
      <h2 className="mb-3 font-display font-semibold text-2xl text-news-text">
        No articles yet
      </h2>
      <p className="mx-auto mb-8 max-w-md font-sans text-news-muted">
        There are no articles in the {categoryName} category yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-news-primary px-4 py-2 font-sans text-sm text-white transition-colors hover:bg-news-primary/90"
      >
        Browse all articles
      </Link>
    </div>
  );
}

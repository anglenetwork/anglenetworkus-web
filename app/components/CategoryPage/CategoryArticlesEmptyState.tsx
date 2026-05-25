import Link from "next/link";

export function CategoryArticlesEmptyState({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <div className="py-12 text-center">
      <h2 className="mb-3 font-sans font-semibold text-2xl text-foreground">
        No articles yet
      </h2>
      <p className="mx-auto mb-8 max-w-md font-sans text-muted-foreground">
        There are no articles in the {categoryName} category yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-sans text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      >
        Browse all articles
      </Link>
    </div>
  );
}

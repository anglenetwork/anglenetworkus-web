import Link from "next/link";

export function CategoryArticlesEmptyState({
  categoryName,
}: {
  categoryName: string;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold font-sans text-foreground mb-3">
        No articles yet
      </h2>
      <p className="text-muted-foreground font-sans mb-8 max-w-md mx-auto">
        There are no articles in the {categoryName} category yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground font-sans text-sm transition-colors hover:bg-primary/90"
      >
        Browse all articles
      </Link>
    </div>
  );
}

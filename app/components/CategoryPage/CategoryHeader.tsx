interface CategoryHeaderProps {
  categoryName: string;
  categoryDescription?: string;
}

export function CategoryHeader({
  categoryName,
  categoryDescription,
}: CategoryHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl">
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance capitalize">
            {categoryName}
          </h1>
          {categoryDescription && (
            <p className="text-muted-foreground font-secondary max-w-2xl">
              {categoryDescription}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

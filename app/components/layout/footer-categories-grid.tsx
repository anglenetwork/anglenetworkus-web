import Link from "next/link";
import { buildFooterCategoryGrid } from "@/app/lib/nav/footer-category-grid";
import type { NavMenuColumn } from "@/app/lib/nav/menu-columns";
import {
  footerCategoryHeading,
  footerTagLink,
} from "@/app/lib/typography/footer";

interface FooterCategoriesGridProps {
  menuColumns: NavMenuColumn[];
}

function FooterCategoryColumn({
  category,
}: {
  category: NonNullable<
    ReturnType<typeof buildFooterCategoryGrid>[number][number]
  >;
}) {
  return (
    <section className="min-w-0">
      <Link
        href={`/category/${category.slug}`}
        className={`${footerCategoryHeading} capitalize`}
      >
        {category.name}
      </Link>
      {category.tags.length > 0 ? (
        <nav
          className="mt-3 flex flex-col gap-2"
          aria-label={`${category.name} tags`}
        >
          {category.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              className={`${footerTagLink} capitalize`}
            >
              {tag.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}

export function FooterCategoriesGrid({
  menuColumns,
}: FooterCategoriesGridProps) {
  const rows = buildFooterCategoryGrid(menuColumns);
  const hasCategories = rows.some((row) => row.some(Boolean));

  if (!hasCategories) {
    return null;
  }

  return (
    <div
      className="space-y-10 border-[#333333] border-t pt-8 pb-8"
      aria-label="Categories and tags"
    >
      {rows.map((row, rowIndex) => (
        <div
          key={`footer-category-row-${rowIndex}`}
          className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {row.map((category, columnIndex) =>
            category ? (
              <FooterCategoryColumn key={category.slug} category={category} />
            ) : (
              <div
                key={`footer-category-empty-${rowIndex}-${columnIndex}`}
                aria-hidden
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

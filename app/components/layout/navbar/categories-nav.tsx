"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Category } from "./types";

const categoryLinkClass =
  "inline-flex shrink-0 items-center whitespace-nowrap px-[13px] py-[7px] font-sans text-[13px] font-semibold text-zinc-900 no-underline transition-colors duration-150 hover:underline";

interface CategoriesNavProps {
  categories: Category[];
  onCategoryClick: () => void;
}

export function CategoriesNav({
  categories,
  onCategoryClick,
}: CategoriesNavProps) {
  const visibleCategories = categories.slice(0, 10);
  const tabletHiddenFromIndex = Math.max(0, visibleCategories.length - 3);

  return (
    <nav
      className="hidden min-w-0 overflow-hidden md:flex md:justify-center md:gap-0.5"
      aria-label="Categories"
    >
      {visibleCategories.map((category, index) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          onClick={onCategoryClick}
          className={cn(
            categoryLinkClass,
            index >= tabletHiddenFromIndex && "max-lg:hidden",
          )}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

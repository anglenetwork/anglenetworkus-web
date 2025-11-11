"use client";

import Link from "next/link";
import { Category } from "./types";

interface CategoriesNavProps {
  categories: Category[];
  isScrolled: boolean;
  onCategoryClick: () => void;
}

export function CategoriesNav({
  categories,
  isScrolled,
  onCategoryClick,
}: CategoriesNavProps) {
  return (
    <nav className="ml-4 flex items-center gap-6">
      {categories.slice(0, 10).map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          onClick={onCategoryClick}
          className={`font-medium -tracking-tight text-neutral-900 capitalize transition-all duration-500 ease-out whitespace-nowrap font-sans ${
            isScrolled ? "lg:text-base" : "lg:text-base"
          } text-base`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

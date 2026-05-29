"use client";

import Link from "next/link";
import { Category } from "./types";

interface CategoriesNavProps {
  categories: Category[];
  onCategoryClick: () => void;
}

export function CategoriesNav({
  categories,
  onCategoryClick,
}: CategoriesNavProps) {
  return (
    <nav className="ml-4 flex items-center gap-8">
      {categories.slice(0, 10).map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          onClick={onCategoryClick}
          className="whitespace-nowrap font-bold font-sans text-base text-black capitalize tracking-tight transition-all duration-500 ease-out"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

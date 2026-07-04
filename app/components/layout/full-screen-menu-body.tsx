"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import { SearchBar } from "../ui/search-bar";
import {
  MenuCategoryAccordion,
  MenuCategorySectionXl,
  MenuTopbar,
} from "./full-screen-menu-parts";

interface FullScreenMenuBodyProps {
  visible: boolean;
  menuCategories: NavMenuCategory[];
  onClose: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function FullScreenMenuBody({
  visible,
  menuCategories,
  onClose,
  searchInputRef,
}: FullScreenMenuBodyProps) {
  const searchProps = {
    placeholder: "Search news, articles, topics and more",
    ariaLabel: "Search news, articles, topics and more",
    onClose,
    inputRef: searchInputRef,
    inputId: "menu-search-input",
  };

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out xl:pb-0",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
      )}
      style={{ transitionDelay: visible ? "150ms" : "0ms" }}
    >
      <MenuTopbar onClose={onClose} />

      <div data-menu-state="open">
        <SearchBar {...searchProps} variant="menu-xl" className="mb-11" />
      </div>

      <div className="xl:hidden">
        <MenuCategoryAccordion categories={menuCategories} onClose={onClose} />
      </div>

      <nav
        className="hidden xl:grid xl:grid-cols-5 xl:gap-x-8 xl:gap-y-12"
        aria-label="Site sections"
      >
        {menuCategories.map((category) => (
          <MenuCategorySectionXl
            key={category.slug}
            category={category}
            onClose={onClose}
          />
        ))}
      </nav>
    </div>
  );
}

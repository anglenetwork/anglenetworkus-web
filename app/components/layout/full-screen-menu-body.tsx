"use client";

import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import { SearchBar } from "../ui/search-bar";
import {
  MenuActionLinks,
  MenuCategoryAccordion,
  MenuCategorySection,
} from "./full-screen-menu-parts";

interface FullScreenMenuBodyProps {
  visible: boolean;
  menuCategories: NavMenuCategory[];
  xlMenuRows: (NavMenuCategory | null)[][];
  onClose: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function FullScreenMenuBody({
  visible,
  menuCategories,
  xlMenuRows,
  onClose,
  searchInputRef,
}: FullScreenMenuBodyProps) {
  return (
    <div
      className={cn(
        "space-y-6 pb-4 transition-all duration-700 ease-out sm:pb-6 md:space-y-12 lg:pb-16 xl:pb-0",
        visible
          ? "translate-y-0 pt-2 opacity-100 md:pt-0"
          : "translate-y-8 opacity-0",
      )}
      style={{ transitionDelay: visible ? "150ms" : "0ms" }}
    >
      <div data-menu-state="open">
        <SearchBar
          placeholder="Search news, articles, topics and more"
          ariaLabel="search bar"
          onClose={onClose}
          inputRef={searchInputRef}
          inputId="menu-search-input"
        />
      </div>

      <div className="md:hidden">
        <MenuCategoryAccordion categories={menuCategories} onClose={onClose} />
      </div>

      <div className="hidden gap-8 md:grid md:grid-cols-2 xl:hidden">
        {menuCategories.map((category) => (
          <MenuCategorySection
            key={category.slug}
            category={category}
            onClose={onClose}
          />
        ))}
      </div>

      <div
        className="hidden gap-x-12 gap-y-8 xl:grid xl:grid-cols-5"
        style={{
          gridTemplateRows: `repeat(${xlMenuRows.length}, auto)`,
        }}
      >
        {xlMenuRows.flatMap((row, rowIndex) =>
          row.map((category, columnIndex) =>
            category ? (
              <MenuCategorySection
                key={category.slug}
                category={category}
                onClose={onClose}
              />
            ) : (
              <div
                key={`xl-menu-empty-${rowIndex}-${columnIndex}`}
                aria-hidden
              />
            ),
          ),
        )}
      </div>

      <MenuActionLinks
        onClose={onClose}
        className="border-border border-t pt-6 md:pt-8"
      />
    </div>
  );
}

"use client";

import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";
import { CategoriesNav } from "./categories-nav";
import { UserMenu } from "./user-menu";
import { Category } from "./types";

interface DesktopHeaderProps {
  isMenuOpen: boolean;
  isScrolled: boolean;
  categories: Category[];
  onMenuToggle: () => void;
  onCategoryClick: () => void;
}

export function DesktopHeader({
  isMenuOpen,
  isScrolled,
  categories,
  onMenuToggle,
  onCategoryClick,
}: DesktopHeaderProps) {
  return (
    <div className="hidden lg:flex items-center justify-between py-4 transition-all duration-500 ease-out">
      <div className="flex items-center gap-4">
        <HamburgerButton
          isOpen={isMenuOpen}
          isScrolled={isScrolled}
          onClick={onMenuToggle}
          variant="desktop"
        />
        <Logo isScrolled={isScrolled} variant="desktop" />
        <CategoriesNav
          categories={categories}
          isScrolled={isScrolled}
          onCategoryClick={onCategoryClick}
        />
      </div>
      <div className="flex items-center gap-2">
        <SearchButton
          onClick={onMenuToggle}
          isScrolled={isScrolled}
          variant="desktop"
        />
        <UserMenu isScrolled={isScrolled} variant="desktop" />
      </div>
    </div>
  );
}


"use client";

import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { CategoriesNav } from "./categories-nav";
import { SearchButton } from "./search-button";
import { SubscribeButton } from "./subscribe-button";
import { NavbarAuthLink } from "./navbar-auth-link";
import { Category } from "./types";

interface UnifiedNavbarProps {
  isMenuOpen: boolean;
  categories: Category[];
  onMenuToggle: () => void;
  onSearchMenuOpen: () => void;
  onCategoryClick: () => void;
}

export function UnifiedNavbar({
  isMenuOpen,
  categories,
  onMenuToggle,
  onSearchMenuOpen,
  onCategoryClick,
}: UnifiedNavbarProps) {
  return (
    <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-6">
      <div className="flex items-center gap-5">
        <HamburgerButton isOpen={isMenuOpen} onClick={onMenuToggle} />
        <Logo />
      </div>

      <CategoriesNav
        categories={categories}
        onCategoryClick={onCategoryClick}
      />

      <div className="flex shrink-0 items-center gap-3">
        <SearchButton onClick={onSearchMenuOpen} />
        <SubscribeButton />
        <NavbarAuthLink />
      </div>
    </div>
  );
}

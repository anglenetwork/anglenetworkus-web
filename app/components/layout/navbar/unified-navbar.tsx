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
  showSubscriptions?: boolean;
  onMenuToggle: () => void;
  onSearchMenuOpen: () => void;
  onCategoryClick: () => void;
}

export function UnifiedNavbar({
  isMenuOpen,
  categories,
  showSubscriptions = false,
  onMenuToggle,
  onSearchMenuOpen,
  onCategoryClick,
}: UnifiedNavbarProps) {
  return (
    <div className="flex h-full items-center justify-between gap-6 xl:grid xl:grid-cols-[auto_1fr_auto]">
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
        {showSubscriptions ? <SubscribeButton /> : null}
        <NavbarAuthLink />
      </div>
    </div>
  );
}

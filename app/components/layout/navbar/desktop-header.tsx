"use client";

import dynamic from "next/dynamic";
import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";
import { CategoriesNav } from "./categories-nav";
import { UserMenuSlot } from "./user-menu-slot";
import { Category } from "./types";

const BecomeProCta = dynamic(
  () =>
    import("./become-pro-cta").then((mod) => ({ default: mod.BecomeProCta })),
  { ssr: false },
);

interface DesktopHeaderProps {
  isMenuOpen: boolean;
  categories: Category[];
  showSubscriptions?: boolean;
  onMenuToggle: () => void;
  onSearchMenuOpen: () => void;
  onCategoryClick: () => void;
}

export function DesktopHeader({
  isMenuOpen,
  categories,
  showSubscriptions = false,
  onMenuToggle,
  onSearchMenuOpen,
  onCategoryClick,
}: DesktopHeaderProps) {
  return (
    <div className="hidden items-center justify-between py-4 transition-all duration-500 ease-out lg:flex">
      <div className="flex items-center gap-4">
        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={onMenuToggle}
          variant="desktop"
        />
        <Logo variant="desktop" />
        <CategoriesNav
          categories={categories}
          onCategoryClick={onCategoryClick}
        />
      </div>
      <div className="flex items-center gap-2">
        <BecomeProCta />
        <SearchButton
          onClick={onSearchMenuOpen}
          variant="desktop"
          className="hidden xl:flex"
        />
        <UserMenuSlot variant="desktop" showSubscriptions={showSubscriptions} />
      </div>
    </div>
  );
}

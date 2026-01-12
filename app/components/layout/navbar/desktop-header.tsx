"use client";

import Link from "next/link";
import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";
import { CategoriesNav } from "./categories-nav";
import { UserMenu } from "./user-menu";
import { Category } from "./types";
import { Button } from "@/components/ui/button";

interface DesktopHeaderProps {
  isMenuOpen: boolean;
  categories: Category[];
  onMenuToggle: () => void;
  onCategoryClick: () => void;
}

export function DesktopHeader({
  isMenuOpen,
  categories,
  onMenuToggle,
  onCategoryClick,
}: DesktopHeaderProps) {
  return (
    <div className="hidden lg:flex items-center justify-between py-4 transition-all duration-500 ease-out mx-16">
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
        <Link href="/pricing">
          <Button
            variant="default"
            size="sm"
            className="bg-black text-white font-medium font-sans"
          >
            Become Pro
          </Button>
        </Link>
        <SearchButton onClick={onMenuToggle} variant="desktop" />
        <UserMenu variant="desktop" />
      </div>
    </div>
  );
}

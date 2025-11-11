"use client";

import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function MobileHeader({
  isMenuOpen,
  onMenuToggle,
}: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between py-3 lg:hidden">
      <HamburgerButton
        isOpen={isMenuOpen}
        isScrolled={false}
        onClick={onMenuToggle}
        variant="mobile"
      />
      <Logo variant="mobile" />
      <SearchButton onClick={onMenuToggle} variant="mobile" />
    </div>
  );
}


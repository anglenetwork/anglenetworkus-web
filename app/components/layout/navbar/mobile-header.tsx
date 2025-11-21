"use client";

import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";
import { UserMenu } from "./user-menu";

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
      <div className="flex items-center gap-2">
        <UserMenu variant="mobile" />
        <SearchButton onClick={onMenuToggle} variant="mobile" />
      </div>
    </div>
  );
}


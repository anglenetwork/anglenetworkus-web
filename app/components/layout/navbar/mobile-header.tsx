"use client";

import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";
import { UserMenu } from "./user-menu";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onSearchMenuOpen: () => void;
}

export function MobileHeader({
  isMenuOpen,
  onMenuToggle,
  onSearchMenuOpen,
}: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between py-3 lg:hidden">
      <HamburgerButton
        isOpen={isMenuOpen}
        onClick={onMenuToggle}
        variant="mobile"
      />
      <Logo variant="mobile" />
      <div className="flex items-center gap-2">
        <UserMenu variant="mobile" hideSignIn />
        <SearchButton onClick={onSearchMenuOpen} variant="mobile" />
      </div>
    </div>
  );
}

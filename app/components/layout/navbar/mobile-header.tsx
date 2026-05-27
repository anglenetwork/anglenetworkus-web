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
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 py-3 lg:hidden">
      <div className="shrink-0">
        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={onMenuToggle}
          variant="mobile"
        />
      </div>
      <Logo variant="mobile" />
      <div className="flex shrink-0 items-center justify-end gap-2">
        <UserMenu variant="mobile" />
        <SearchButton
          onClick={onSearchMenuOpen}
          variant="mobile"
          className="hidden xl:flex"
        />
      </div>
    </div>
  );
}

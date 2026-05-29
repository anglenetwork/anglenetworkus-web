"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  variant?: "mobile" | "desktop";
}

export function HamburgerButton({
  isOpen,
  onClick,
  variant = "mobile",
}: HamburgerButtonProps) {
  if (variant === "mobile") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative flex size-10 items-center justify-center rounded-full bg-transparent p-0 transition-all duration-500 ease-out"
      >
        <div className="relative flex size-5 items-center justify-center">
          <Menu
            className={`absolute size-5 text-black transition-all duration-300 ease-in-out ${
              isOpen
                ? "rotate-180 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            className={`absolute size-5 text-black transition-all duration-300 ease-in-out ${
              isOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-180 scale-0 opacity-0"
            }`}
          />
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="relative flex size-10 items-center justify-center rounded-full bg-transparent p-0 transition-all duration-500 ease-out lg:h-8 lg:w-8"
    >
      <div className="relative flex size-5 items-center justify-center transition-all duration-500 ease-out lg:h-4 lg:w-4">
        <Menu
          className={`absolute size-5 text-black transition-all duration-300 ease-in-out lg:h-4 lg:w-4 ${
            isOpen
              ? "rotate-180 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <X
          className={`absolute size-5 text-black transition-all duration-300 ease-in-out lg:h-4 lg:w-4 ${
            isOpen
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-180 scale-0 opacity-0"
          }`}
        />
      </div>
    </Button>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HamburgerButtonProps {
  isOpen: boolean;
  isScrolled: boolean;
  onClick: () => void;
  variant?: "mobile" | "desktop";
}

export function HamburgerButton({
  isOpen,
  isScrolled,
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
        className="rounded-full bg-transparent p-0 relative flex items-center justify-center transition-all duration-500 ease-out h-10 w-10"
      >
        <div className="relative flex items-center justify-center w-5 h-5">
          <Menu
            className={`text-black absolute transition-all duration-300 ease-in-out h-5 w-5 ${
              isOpen
                ? "opacity-0 rotate-180 scale-0"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <X
            className={`text-black absolute transition-all duration-300 ease-in-out h-5 w-5 ${
              isOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-180 scale-0"
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
      className={`rounded-full bg-transparent p-0 relative flex items-center justify-center transition-all duration-500 ease-out ${
        isScrolled ? "lg:h-8 lg:w-8" : "lg:h-10 lg:w-10"
      } h-10 w-10`}
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ease-out ${
        isScrolled ? "lg:w-4 lg:h-4" : "lg:w-5 lg:h-5"
      } w-5 h-5`}
      >
        <Menu
          className={`text-black absolute transition-all duration-300 ease-in-out ${
            isScrolled ? "lg:h-4 lg:w-4" : "lg:h-5 lg:w-5"
          } h-5 w-5 ${
            isOpen
              ? "opacity-0 rotate-180 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <X
          className={`text-black absolute transition-all duration-300 ease-in-out ${
            isScrolled ? "lg:h-4 lg:w-4" : "lg:h-5 lg:w-5"
          } h-5 w-5 ${
            isOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0"
          }`}
        />
      </div>
    </Button>
  );
}


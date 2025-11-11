"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  onClick: () => void;
  isScrolled?: boolean;
  variant?: "mobile" | "desktop";
}

export function SearchButton({
  onClick,
  isScrolled = false,
  variant = "mobile",
}: SearchButtonProps) {
  if (variant === "mobile") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        aria-label="Open search menu"
        className="rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 h-10 w-10"
      >
        <Search className="text-black h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label="Open search menu"
      className={`rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 transition-all duration-500 ease-out ${
        isScrolled ? "lg:h-8 lg:w-8" : "lg:h-10 lg:w-10"
      } h-10 w-10`}
    >
      <Search
        className={`text-black transition-all duration-500 ease-out ${
          isScrolled ? "lg:h-4 lg:w-4" : "lg:h-5 lg:w-5"
        } h-5 w-5`}
      />
    </Button>
  );
}


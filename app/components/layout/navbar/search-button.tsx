"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  onClick: () => void;
  variant?: "mobile" | "desktop";
}

export function SearchButton({
  onClick,
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
      className="rounded-full bg-transparent p-0 flex items-center justify-center hover:bg-gray-100 transition-all duration-500 ease-out lg:h-8 lg:w-8 h-10 w-10"
    >
      <Search className="text-black transition-all duration-500 ease-out lg:h-4 lg:w-4 h-5 w-5" />
    </Button>
  );
}


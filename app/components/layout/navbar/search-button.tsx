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
        className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 hover:bg-gray-100"
      >
        <Search className="h-5 w-5 text-black" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label="Open search menu"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 transition-all duration-500 ease-out hover:bg-gray-100 lg:h-8 lg:w-8"
    >
      <Search className="h-5 w-5 text-black transition-all duration-500 ease-out lg:h-4 lg:w-4" />
    </Button>
  );
}

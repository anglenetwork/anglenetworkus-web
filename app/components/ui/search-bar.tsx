"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Ref } from "react";

interface SearchBarProps {
  placeholder?: string;
  ariaLabel?: string;
  onSubmit?: (query: string) => void;
  onClose?: () => void;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  inputId?: string;
}

export function SearchBar({
  placeholder = "Search news, opinion, and analysis",
  ariaLabel = "search bar",
  onSubmit,
  onClose,
  className = "",
  inputRef,
  inputId,
}: SearchBarProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;

    if (query.trim()) {
      // Close any open modals/menus first
      if (onClose) {
        onClose();
      }

      // If custom onSubmit is provided, use it
      if (onSubmit) {
        onSubmit(query.trim());
      } else {
        // Default behavior: navigate to search results page
        router.push(
          `/search?q=${encodeURIComponent(query.trim())}&sort=relevance&type=all&page=1`,
        );
      }
    }
  };

  return (
    <form
      className={`relative w-full ${className}`}
      role="search"
      aria-label={ariaLabel}
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        name="search"
        placeholder={placeholder}
        className="h-12 w-full rounded-lg bg-neutral-100 pr-16 pl-6 font-sans text-foreground text-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="absolute top-1/2 right-3 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="h-6 w-6 text-neutral-600" strokeWidth={2.5} />
      </button>
    </form>
  );
}

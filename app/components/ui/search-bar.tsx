"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  ariaLabel?: string;
  onSubmit?: (query: string) => void;
  onClose?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search news, opinion, and analysis",
  ariaLabel = "search bar",
  onSubmit,
  onClose,
  className = "",
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
          `/search?q=${encodeURIComponent(query.trim())}&sort=relevance&type=all&page=1`
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
        type="search"
        name="search"
        placeholder={placeholder}
        className="w-full h-12 pl-6 pr-16 border border-foreground rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-sans text-sm"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="h-7 w-7 text-primary" strokeWidth={2.5} />
      </button>
    </form>
  );
}

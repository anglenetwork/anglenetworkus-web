"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Ref } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  ariaLabel?: string;
  onSubmit?: (query: string) => void;
  onClose?: () => void;
  className?: string;
  inputRef?: Ref<HTMLInputElement>;
  inputId?: string;
  variant?: "default" | "menu-xl";
}

export function SearchBar({
  placeholder = "Search news, opinion, and analysis",
  ariaLabel = "search bar",
  onSubmit,
  onClose,
  className = "",
  inputRef,
  inputId,
  variant = "default",
}: SearchBarProps) {
  const { push } = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;

    if (query.trim()) {
      if (onClose) {
        onClose();
      }

      if (onSubmit) {
        onSubmit(query.trim());
      } else {
        push(
          `/search?q=${encodeURIComponent(query.trim())}&sort=relevance&type=all&page=1`,
        );
      }
    }
  };

  if (variant === "menu-xl") {
    return (
      <form
        className={cn(
          "flex w-full items-center gap-3.5 rounded-[10px] border border-border bg-news-background px-5 py-[15px] transition-[border-color] duration-150 focus-within:border-foreground",
          className,
        )}
        role="search"
        aria-label={ariaLabel}
        onSubmit={handleSubmit}
      >
        <Search
          className="size-5 shrink-0 text-muted-foreground"
          strokeWidth={2}
          aria-hidden
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          name="search"
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="min-w-0 flex-1 border-none bg-transparent font-sans text-base text-foreground outline-none placeholder:text-news-muted"
        />
      </form>
    );
  }

  return (
    <form
      className={cn("relative w-full", className)}
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
        aria-label={ariaLabel}
        className="h-12 w-full rounded-lg border border-border bg-news-background pr-16 pl-6 font-sans text-base text-foreground transition-all placeholder:text-news-muted focus:border-foreground focus:outline-none"
      />
      <button
        type="submit"
        className="absolute top-1/2 right-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="size-6 text-news-muted" strokeWidth={2.5} />
      </button>
    </form>
  );
}

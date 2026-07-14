"use client";

import { cn } from "@/lib/utils";

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function SearchButton({ onClick, className }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open search menu"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-news-muted transition-colors duration-150 hover:bg-news-surface hover:text-news-text",
        className,
      )}
    >
      <SearchIcon />
    </button>
  );
}

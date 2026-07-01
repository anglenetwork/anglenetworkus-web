"use client";

import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="group rounded-lg p-1.5 transition-colors duration-150 hover:bg-stone-100"
    >
      <span className="flex w-5 flex-col items-start justify-center gap-[5px]">
        <span
          className={cn(
            "block h-0.5 rounded-sm bg-zinc-900 transition-all duration-150",
            isOpen ? "w-5 translate-y-[7px] rotate-45" : "w-5 group-hover:w-5",
          )}
        />
        <span
          className={cn(
            "block h-0.5 rounded-sm bg-zinc-900 transition-all duration-150",
            isOpen ? "w-0 opacity-0" : "w-3.5 group-hover:w-5",
          )}
        />
        <span
          className={cn(
            "block h-0.5 rounded-sm bg-zinc-900 transition-all duration-150",
            isOpen
              ? "w-5 -translate-y-[7px] -rotate-45"
              : "w-[17px] group-hover:w-5",
          )}
        />
      </span>
    </button>
  );
}

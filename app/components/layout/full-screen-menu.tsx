"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import { FullScreenMenuBody } from "./full-screen-menu-body";
import { FullScreenMenuFooter } from "./full-screen-menu-footer";

interface FullScreenMenuProps {
  menuCategories: NavMenuCategory[];
  onClose: () => void;
  focusSearchOnOpen?: boolean;
  onFocusSearchHandled?: () => void;
}

export function FullScreenMenu({
  menuCategories,
  onClose,
  focusSearchOnOpen = false,
  onFocusSearchHandled,
}: FullScreenMenuProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const onFocusSearchHandledRef = useRef(onFocusSearchHandled);
  onCloseRef.current = onClose;
  onFocusSearchHandledRef.current = onFocusSearchHandled;

  useLayoutEffect(() => {
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  useEffect(() => {
    if (!focusSearchOnOpen) return;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      onFocusSearchHandledRef.current?.();
    });

    return () => cancelAnimationFrame(frameId);
  }, [focusSearchOnOpen]);

  return (
    <dialog
      ref={dialogRef}
      open
      aria-modal="true"
      aria-label="Navigation menu"
      data-state="open"
      className={cn(
        "fixed inset-0 z-[110] m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-background p-0",
        "fade-in animate-in duration-200 motion-reduce:animate-none",
      )}
      style={{ height: "100svh" }}
    >
      <div className="h-full max-h-[100svh] overflow-y-auto overscroll-contain pt-0 xl:pb-14">
        <div
          className={cn(
            "mx-auto w-full max-w-[1400px]",
            "px-5 pt-7 pb-10 max-[480px]:px-5 max-[480px]:pt-5 max-[480px]:pb-10",
            "sm:px-10 sm:pt-7 sm:pb-14",
            "xl:px-16 xl:pt-7 xl:pb-14",
          )}
        >
          <FullScreenMenuBody
            menuCategories={menuCategories}
            onClose={onClose}
            searchInputRef={searchInputRef}
          />
          <FullScreenMenuFooter onClose={onClose} />
        </div>
      </div>
    </dialog>
  );
}

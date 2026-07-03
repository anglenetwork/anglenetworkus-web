"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_PAGE_WIDTH_HUB_CLASS } from "@/app/components/layout/site-page-width";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import { buildNavCategoryGrid } from "@/app/lib/nav/menu-columns";
import {
  FOOTER_CATEGORY_GRID_COLUMNS,
  FOOTER_CATEGORY_GRID_ROWS,
} from "@/app/lib/nav/footer-category-grid";
import { FullScreenMenuBody } from "./full-screen-menu-body";
import { FullScreenMenuFooter } from "./full-screen-menu-footer";

interface FullScreenMenuProps {
  menuCategories: NavMenuCategory[];
  onClose: () => void;
  headerOffset: number;
  focusSearchOnOpen?: boolean;
  onFocusSearchHandled?: () => void;
}

export function FullScreenMenu({
  menuCategories,
  onClose,
  headerOffset,
  focusSearchOnOpen = false,
  onFocusSearchHandled,
}: FullScreenMenuProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const onFocusSearchHandledRef = useRef(onFocusSearchHandled);
  onCloseRef.current = onClose;
  onFocusSearchHandledRef.current = onFocusSearchHandled;

  const [visible, setVisible] = useState(false);
  const xlMenuRows = useMemo(
    () =>
      buildNavCategoryGrid(
        menuCategories,
        FOOTER_CATEGORY_GRID_COLUMNS,
        FOOTER_CATEGORY_GRID_ROWS,
      ),
    [menuCategories],
  );

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setVisible(true));

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.addEventListener("keydown", handleEscKey);

    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
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
        "fixed inset-0 z-40 m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-background p-0 transition-all duration-500 ease-in-out",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ height: "100svh" }}
    >
      <div
        className="h-full max-h-[100svh] overflow-y-auto overscroll-contain"
        style={{ paddingTop: `${headerOffset || 0}px` }}
      >
        <div className={cn(SITE_PAGE_WIDTH_HUB_CLASS, "md:py-6")}>
          <FullScreenMenuBody
            visible={visible}
            menuCategories={menuCategories}
            xlMenuRows={xlMenuRows}
            onClose={onClose}
            searchInputRef={searchInputRef}
          />
          <FullScreenMenuFooter visible={visible} onClose={onClose} />
        </div>
      </div>
    </dialog>
  );
}

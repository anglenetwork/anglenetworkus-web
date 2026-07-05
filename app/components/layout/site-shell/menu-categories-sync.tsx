"use client";

import { useLayoutEffect } from "react";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import { useSetMenuCategories } from "./menu-categories-provider";

export function MenuCategoriesSync({
  menuCategories,
}: {
  menuCategories: NavMenuCategory[];
}) {
  const setMenuCategories = useSetMenuCategories();

  useLayoutEffect(() => {
    setMenuCategories?.(menuCategories);
  }, [menuCategories, setMenuCategories]);

  return null;
}

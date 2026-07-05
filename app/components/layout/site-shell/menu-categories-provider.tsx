"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";

type MenuCategoriesContextValue = {
  menuCategories: NavMenuCategory[];
  setMenuCategories: (menuCategories: NavMenuCategory[]) => void;
};

const MenuCategoriesContext = createContext<MenuCategoriesContextValue | null>(
  null,
);

export function MenuCategoriesProvider({
  initialMenuCategories,
  children,
}: {
  initialMenuCategories: NavMenuCategory[];
  children: ReactNode;
}) {
  const [menuCategories, setMenuCategories] = useState(initialMenuCategories);
  const value = useMemo(
    () => ({ menuCategories, setMenuCategories }),
    [menuCategories],
  );

  return (
    <MenuCategoriesContext.Provider value={value}>
      {children}
    </MenuCategoriesContext.Provider>
  );
}

export function useMenuCategories(
  fallback: NavMenuCategory[],
): NavMenuCategory[] {
  const context = useContext(MenuCategoriesContext);
  return context?.menuCategories ?? fallback;
}

export function useSetMenuCategories():
  | ((menuCategories: NavMenuCategory[]) => void)
  | null {
  return useContext(MenuCategoriesContext)?.setMenuCategories ?? null;
}

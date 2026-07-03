export type { Category, NavMenuCategory } from "../site-shell/types";
import type { Category, NavMenuCategory } from "../site-shell/types";

export interface HeaderProps {
  categories: Category[];
  menuCategories: NavMenuCategory[];
  showSubscriptions?: boolean;
}

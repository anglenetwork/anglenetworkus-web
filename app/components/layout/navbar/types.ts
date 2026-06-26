export type { Category, Tag, NavMenuColumn } from "../site-shell/types";
import type { Category, NavMenuColumn } from "../site-shell/types";

export interface HeaderProps {
  categories: Category[];
  menuColumns: NavMenuColumn[];
  showSubscriptions?: boolean;
}

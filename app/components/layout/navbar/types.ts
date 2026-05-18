export type { Category, Tag } from "../site-shell/types";
import type { Category, Tag } from "../site-shell/types";

export interface HeaderProps {
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
}

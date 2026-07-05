import type { NavTagWithCategory } from "@/app/lib/nav/menu-columns";

type NavTagRow = {
  slug: string | null;
  title: string | null;
  categorySlug: string | null;
};

export function mapNavTags(rows: NavTagRow[]): NavTagWithCategory[] {
  return rows.filter(
    (
      tag,
    ): tag is NavTagRow & {
      slug: string;
      title: string;
      categorySlug: string;
    } => tag.slug !== null && tag.title !== null && tag.categorySlug !== null,
  );
}

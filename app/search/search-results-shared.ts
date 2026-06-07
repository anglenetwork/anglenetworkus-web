import type { SortParam, TypeParam } from "@/app/lib/search/editorial-search";
import { cn } from "@/lib/utils";

export const TYPE_OPTIONS = [
  ["all", "All"],
  ["post", "News"],
  ["opinion", "Opinion"],
  ["analysis", "Analysis"],
  ["sponsored", "Sponsored"],
] as const;

export const TYPE_POSTS_LABEL: Record<TypeParam, string> = {
  all: "All",
  post: "News",
  opinion: "Opinion",
  analysis: "Analysis",
  sponsored: "Sponsored",
};

export function desktopFilterLinkClass(isActive: boolean) {
  return cn(
    "rounded-lg font-sans",
    "xl:h-auto xl:min-h-0 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:text-base xl:shadow-none",
    isActive
      ? "xl:font-semibold xl:text-red-600 xl:underline xl:underline-offset-4 hover:xl:bg-transparent hover:xl:text-red-600"
      : "xl:font-normal xl:text-neutral-900 xl:no-underline xl:underline-offset-4 hover:xl:bg-transparent hover:xl:text-neutral-900 hover:xl:underline",
  );
}

export function buildSearchPath(
  sp: URLSearchParams,
  updates: Record<string, string | null>,
) {
  const next = new URLSearchParams(sp.toString());
  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === "") next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `/search?${qs}` : "/search";
}

export type SearchNavigate = (updates: Record<string, string | null>) => void;

export function createSearchHandlers(
  navigate: SearchNavigate,
  onApplyType?: () => void,
) {
  return {
    handleSort: (next: SortParam) => {
      navigate({ sort: next, page: null });
    },
    handleType: (next: TypeParam) => {
      navigate({ type: next, page: null });
      onApplyType?.();
    },
    handlePage: (nextPage: number) => {
      navigate({ page: nextPage <= 1 ? null : String(nextPage) });
    },
  };
}

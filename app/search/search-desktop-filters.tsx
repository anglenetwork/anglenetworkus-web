"use client";

import { Button } from "@/components/ui/button";
import type { SortParam, TypeParam } from "@/app/lib/search/editorial-search";
import { searchFilterLabel } from "@/app/lib/typography/search-page";
import { TYPE_OPTIONS, desktopFilterLinkClass } from "./search-results-shared";

type SearchDesktopFiltersProps = {
  sort: SortParam;
  type: TypeParam;
  onSortChange: (sort: SortParam) => void;
  onTypeChange: (type: TypeParam) => void;
};

export function SearchDesktopFilters({
  sort,
  type,
  onSortChange,
  onTypeChange,
}: SearchDesktopFiltersProps) {
  return (
    <div className="hidden flex-col gap-8 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:justify-start">
      <div className="flex flex-row flex-wrap items-center gap-2">
        <span className={searchFilterLabel}>Type</span>
        {TYPE_OPTIONS.map(([value, label]) => {
          const isActive = type === value;
          return (
            <Button
              key={value}
              type="button"
              variant={isActive ? "default" : "outline"}
              className={desktopFilterLinkClass(isActive)}
              onClick={() => onTypeChange(value)}
            >
              {label}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={searchFilterLabel}>Sort</span>
        <Button
          type="button"
          variant={sort === "relevance" ? "default" : "outline"}
          className={desktopFilterLinkClass(sort === "relevance")}
          onClick={() => onSortChange("relevance")}
        >
          Relevance
        </Button>
        <Button
          type="button"
          variant={sort === "newest" ? "default" : "outline"}
          className={desktopFilterLinkClass(sort === "newest")}
          onClick={() => onSortChange("newest")}
        >
          Newest
        </Button>
      </div>
    </div>
  );
}

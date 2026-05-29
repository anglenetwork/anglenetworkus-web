"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { SortParam, TypeParam } from "@/app/lib/search/editorial-search";
import { ArrowDownUp, ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPE_OPTIONS } from "./search-results-shared";

type SearchMobileFiltersProps = {
  sort: SortParam;
  typeFilterOpen: boolean;
  pendingType: TypeParam;
  onDialogOpenChange: (open: boolean) => void;
  onPendingTypeChange: (value: TypeParam) => void;
  onApplyTypeFilter: () => void;
  onSortChange: (sort: SortParam) => void;
};

export function SearchMobileFilters({
  sort,
  typeFilterOpen,
  pendingType,
  onDialogOpenChange,
  onPendingTypeChange,
  onApplyTypeFilter,
  onSortChange,
}: SearchMobileFiltersProps) {
  return (
    <div className="flex w-full items-center justify-start gap-3 xl:hidden">
      <Dialog open={typeFilterOpen} onOpenChange={onDialogOpenChange}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-lg font-sans"
          >
            <ListFilter className="size-4" />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent
          className="data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom fixed inset-0 top-0 left-0 z-50 flex h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 font-sans shadow-lg [&>button]:hidden"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            document.getElementById(`search-type-${pendingType}`)?.focus();
          }}
        >
          <div className="flex items-center px-6 py-4">
            <div className="size-12 shrink-0" aria-hidden />
            <DialogTitle className="flex-1 text-center font-semibold text-xl leading-none">
              Filter by type
            </DialogTitle>
            <DialogClose className="flex size-12 shrink-0 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="size-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-6 pt-2">
            <RadioGroup
              value={pendingType}
              onValueChange={(value) => onPendingTypeChange(value as TypeParam)}
              className="gap-5 px-2"
            >
              {TYPE_OPTIONS.map(([value, label]) => (
                <div key={value} className="flex items-center gap-4 py-1">
                  <RadioGroupItem
                    value={value}
                    id={`search-type-${value}`}
                    className="size-5 border-neutral-300 text-red-600 focus-visible:ring-red-600 data-[state=checked]:border-red-600 [&_svg]:fill-red-600"
                  />
                  <Label
                    htmlFor={`search-type-${value}`}
                    className={cn(
                      "cursor-pointer font-normal text-lg leading-snug",
                      pendingType === value && "text-red-600",
                    )}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="px-6 pt-6 pb-8">
            <Button
              type="button"
              className="h-12 w-full rounded-lg bg-red-600 font-sans text-base text-white hover:bg-red-700"
              onClick={onApplyTypeFilter}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Select value={sort} onValueChange={(value) => onSortChange(value as SortParam)}>
        <SelectTrigger
          className="h-9 w-auto shrink-0 justify-start gap-2 rounded-lg px-3 font-sans [&>span]:hidden"
          aria-label={`Sort, ${sort === "newest" ? "Newest" : "Relevance"} selected`}
        >
          <ArrowDownUp className="size-4 shrink-0" />
          Sort
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

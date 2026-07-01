"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

const menuSecondaryLinkClass =
  "font-normal font-sans text-lg transition-colors hover:text-primary xl:text-base";

const menuNavListClass = "mt-4 flex flex-col gap-2";
const menuCategoryLinkClass =
  "font-semibold font-sans text-2xl capitalize transition-colors hover:text-primary xl:text-2xl";

const menuActionLinkClass =
  "font-sans font-semibold text-lg transition-colors hover:text-primary";

export function MenuCategoryAccordion({
  categories,
  onClose,
}: {
  categories: NavMenuCategory[];
  onClose: () => void;
}) {
  return (
    <Accordion type="multiple" className="w-full">
      {categories.map((category) => (
        <AccordionItem
          key={category.slug}
          value={category.slug}
          className="border-border border-b border-dotted"
        >
          <AccordionPrimitive.Header className="flex items-center justify-between">
            <Link
              href={`/category/${category.slug}`}
              onClick={onClose}
              className={cn(menuCategoryLinkClass, "shrink-0 py-3")}
            >
              {category.name}
            </Link>
            <AccordionPrimitive.Trigger
              className={cn(
                "flex flex-1 items-center justify-end py-3 pl-4 hover:no-underline",
                "text-muted-foreground transition-colors hover:text-primary",
                "[&[data-state=open]>svg]:rotate-180",
              )}
            >
              <span className="sr-only">Show {category.name} tags</span>
              <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent>
            {category.tags.length > 0 ? (
              <nav
                className={menuNavListClass}
                aria-label={`${category.name} tags`}
              >
                {category.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    onClick={onClose}
                    className={menuSecondaryLinkClass}
                  >
                    {tag.title}
                  </Link>
                ))}
              </nav>
            ) : (
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className={menuSecondaryLinkClass}
              >
                View {category.name}
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function MenuCategorySection({
  category,
  onClose,
}: {
  category: NavMenuCategory;
  onClose: () => void;
}) {
  return (
    <section>
      <Link
        href={`/category/${category.slug}`}
        onClick={onClose}
        className={menuCategoryLinkClass}
      >
        {category.name}
      </Link>
      {category.tags.length > 0 ? (
        <nav className={menuNavListClass} aria-label={`${category.name} tags`}>
          {category.tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tag/${tag.slug}`}
              onClick={onClose}
              className={menuSecondaryLinkClass}
            >
              {tag.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}

export function MenuActionLinks({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-x-8 gap-y-3", className)}>
      <Link href="/opinion" onClick={onClose} className={menuActionLinkClass}>
        Opinion
      </Link>
      <Link href="/analysis" onClick={onClose} className={menuActionLinkClass}>
        Analysis
      </Link>
      <Link
        href="/company/advertise-with-us"
        onClick={onClose}
        className={menuActionLinkClass}
      >
        Partner with us
      </Link>
      <Link
        href="/company/contact"
        onClick={onClose}
        className={menuActionLinkClass}
      >
        Contact
      </Link>
    </div>
  );
}

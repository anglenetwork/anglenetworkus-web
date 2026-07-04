"use client";

import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import {
  menuAccordionCategoryHeading,
  menuAccordionTagLink,
  menuActionLink,
  menuStackedActionLink,
  xlMenuActionLink,
  xlMenuCategoryHeading,
  xlMenuTagLink,
} from "@/app/lib/typography/full-screen-menu";
import { Logo } from "./navbar/logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

export function MenuCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close menu"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors duration-150 hover:bg-news-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-link focus-visible:outline-offset-[3px]"
    >
      <X className="size-[18px]" strokeWidth={2.4} aria-hidden />
    </button>
  );
}

export function MenuTopbar({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Logo />
      <MenuCloseButton onClose={onClose} />
    </div>
  );
}

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
          className="border-0 border-b border-dotted border-border pb-0 last:border-b"
        >
          <AccordionPrimitive.Header className="m-0 flex items-center gap-3 py-5">
            <h2 className="m-0 min-w-0 shrink-0">
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className={cn(menuAccordionCategoryHeading, "inline-block")}
              >
                {category.name}
              </Link>
            </h2>
            <AccordionPrimitive.Trigger
              className={cn(
                "flex min-h-11 min-w-0 flex-1 items-center justify-end self-stretch p-0 hover:no-underline",
                "[&[data-state=open]>svg]:rotate-180",
              )}
            >
              <span className="sr-only">Show {category.name} tags</span>
              <ChevronDown
                className="size-[18px] shrink-0 text-foreground transition-transform duration-200"
                strokeWidth={2.2}
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="pb-[18px] pl-1 pt-0.5">
            {category.tags.length > 0 ? (
              <nav aria-label={`${category.name} tags`}>
                <ul className="m-0 list-none p-0">
                  {category.tags.map((tag) => (
                    <li key={tag.slug} className="mt-0.5 first:mt-0">
                      <Link
                        href={`/tag/${tag.slug}`}
                        onClick={onClose}
                        className={menuAccordionTagLink}
                      >
                        {tag.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className={menuAccordionTagLink}
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

export function MenuCategorySectionXl({
  category,
  onClose,
}: {
  category: NavMenuCategory;
  onClose: () => void;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-[18px] border-foreground border-b-2 pb-3">
        <h2 className="m-0">
          <Link
            href={`/category/${category.slug}`}
            onClick={onClose}
            className={xlMenuCategoryHeading}
          >
            {category.name}
          </Link>
        </h2>
      </div>
      {category.tags.length > 0 ? (
        <nav aria-label={`${category.name} tags`}>
          <ul className="m-0 list-none p-0">
            {category.tags.map((tag) => (
              <li key={tag.slug} className="mt-0.5 first:mt-0">
                <Link
                  href={`/tag/${tag.slug}`}
                  onClick={onClose}
                  className={xlMenuTagLink}
                >
                  {tag.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </section>
  );
}

export function MenuActionLinks({
  onClose,
  className,
  variant = "default",
}: {
  onClose: () => void;
  className?: string;
  variant?: "default" | "xl" | "stacked";
}) {
  const links = [
    { href: "/opinion", label: "Opinion" },
    { href: "/analysis", label: "Analysis" },
    { href: "/company/advertise-with-us", label: "Partner with us" },
    { href: "/company/contact", label: "Contact" },
  ] as const;

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-0", className)}>
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              menuStackedActionLink,
              "border-border border-t border-dotted py-[18px]",
              index === 0 && "border-t-0",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  const linkClass = variant === "xl" ? xlMenuActionLink : menuActionLink;
  const gapClass = "gap-x-7 gap-y-3";

  return (
    <div className={cn("flex flex-wrap", gapClass, className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className={linkClass}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

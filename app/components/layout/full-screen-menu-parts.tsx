"use client";

import Link from "next/link";
import { ChevronDown, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useReducer } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { NavMenuCategory } from "@/app/lib/nav/menu-columns";
import {
  menuAccordionCategoryHeading,
  menuAccordionTagLink,
  menuActionLink,
  menuSignInLink,
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
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors duration-150 hover:bg-news-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-news-primary focus-visible:outline-offset-[3px]"
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
          className="border-0 border-border border-b border-dotted pb-0 last:border-b"
        >
          <AccordionPrimitive.Header className="m-0 flex items-center gap-3 py-3">
            <Link
              href={`/category/${category.slug}`}
              onClick={onClose}
              className={cn(
                menuAccordionCategoryHeading,
                "inline-block min-w-0 shrink-0",
              )}
            >
              {category.name}
            </Link>
            <AccordionPrimitive.Trigger
              className={cn(
                "flex min-w-0 flex-1 items-center justify-end self-stretch p-0 hover:no-underline",
                "[&[data-state=open]>svg]:rotate-180",
              )}
            >
              <span className="sr-only">Show {category.name} tags</span>
              <ChevronDown
                className="size-[18px] shrink-0 text-foreground transition-transform duration-200"
                strokeWidth={2.5}
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="pt-0 pb-3 pl-1">
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
      <div className={cn("flex flex-col", className)}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(menuStackedActionLink, "py-3.5")}
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

type MenuAuthState = { user: { id: string } | null; loading: boolean };

type MenuAuthAction =
  | { type: "resolved"; user: { id: string } | null }
  | { type: "auth_change"; user: { id: string } | null };

function menuAuthReducer(
  state: MenuAuthState,
  action: MenuAuthAction,
): MenuAuthState {
  switch (action.type) {
    case "resolved":
      return { user: action.user, loading: false };
    case "auth_change":
      return { ...state, user: action.user, loading: false };
    default:
      return state;
  }
}

const initialMenuAuthState: MenuAuthState = { user: null, loading: true };

const stackedFooterRowClass = "py-3.5";

function MenuFooterAuthLink({
  onClose,
  loading,
  user,
}: {
  onClose: () => void;
  loading: boolean;
  user: { id: string } | null;
}) {
  const authIcon = (
    <UserRound className="size-[18px] shrink-0" strokeWidth={2.5} aria-hidden />
  );

  if (loading) {
    return (
      <span
        className={cn(menuSignInLink, stackedFooterRowClass, "invisible")}
        aria-hidden
      >
        {authIcon}
        Sign in
      </span>
    );
  }

  if (user) {
    return (
      <Link
        href="/myprofile"
        onClick={onClose}
        className={cn(menuSignInLink, stackedFooterRowClass)}
      >
        {authIcon}
        Account
      </Link>
    );
  }

  return (
    <Link
      href="/signin"
      onClick={onClose}
      className={cn(menuSignInLink, stackedFooterRowClass)}
    >
      {authIcon}
      Sign in
    </Link>
  );
}

export function MenuStackedFooterLinks({ onClose }: { onClose: () => void }) {
  const supabase = useMemo(() => createClient(), []);
  const [state, dispatch] = useReducer(menuAuthReducer, initialMenuAuthState);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      dispatch({ type: "resolved", user: session?.user ?? null });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || event === "INITIAL_SESSION") return;
      dispatch({ type: "auth_change", user: session?.user ?? null });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex flex-col">
      <Link
        href="/opinion"
        onClick={onClose}
        className={cn(menuStackedActionLink, stackedFooterRowClass, "block")}
      >
        Opinion
      </Link>
      <Link
        href="/analysis"
        onClick={onClose}
        className={cn(menuStackedActionLink, stackedFooterRowClass, "block")}
      >
        Analysis
      </Link>
      <MenuFooterAuthLink
        onClose={onClose}
        loading={state.loading}
        user={state.user}
      />
      <div className={cn("flex flex-wrap items-center gap-x-7 py-3.5")}>
        <Link
          href="/company/advertise-with-us"
          onClick={onClose}
          className={menuStackedActionLink}
        >
          Partner with us
        </Link>
        <Link
          href="/company/contact"
          onClick={onClose}
          className={menuStackedActionLink}
        >
          Contact
        </Link>
      </div>
    </div>
  );
}

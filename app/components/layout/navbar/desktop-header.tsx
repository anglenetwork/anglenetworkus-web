"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HamburgerButton } from "./hamburger-button";
import { Logo } from "./logo";
import { SearchButton } from "./search-button";
import { CategoriesNav } from "./categories-nav";
import { UserMenu } from "./user-menu";
import { Category } from "./types";
import { createClient } from "@/lib/supabase/client";
import type { Tier } from "@/lib/subscriptions/tier";

interface DesktopHeaderProps {
  isMenuOpen: boolean;
  categories: Category[];
  onMenuToggle: () => void;
  onCategoryClick: () => void;
}

export function DesktopHeader({
  isMenuOpen,
  categories,
  onMenuToggle,
  onCategoryClick,
}: DesktopHeaderProps) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<any>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUserAndTier = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          // Ensure subscription row exists
          await supabase.rpc("ensure_subscription_row");

          const { data, error } = await supabase
            .from("subscriptions")
            .select("tier, valid_until")
            .maybeSingle();

          if (error) throw error;

          let effectiveTier: Tier = (data?.tier ?? "free") as Tier;
          const validUntil = data?.valid_until;

          // If pro but expired, treat as free
          if (effectiveTier === "pro" && validUntil) {
            const now = new Date();
            const until = new Date(validUntil);
            if (until < now) {
              effectiveTier = "free";
            }
          }

          if (mounted) {
            setTier(effectiveTier);
          }
        } catch (error) {
          console.error("Error loading subscription:", error);
          if (mounted) {
            setTier("free");
          }
        }
      } else {
        if (mounted) {
          setTier(null);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    };

    loadUserAndTier();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          await supabase.rpc("ensure_subscription_row");

          const { data, error } = await supabase
            .from("subscriptions")
            .select("tier, valid_until")
            .maybeSingle();

          if (error) throw error;

          let effectiveTier: Tier = (data?.tier ?? "free") as Tier;
          const validUntil = data?.valid_until;

          if (effectiveTier === "pro" && validUntil) {
            const now = new Date();
            const until = new Date(validUntil);
            if (until < now) {
              effectiveTier = "free";
            }
          }

          setTier(effectiveTier);
        } catch (error) {
          console.error("Error loading subscription:", error);
          setTier("free");
        }
      } else {
        setTier(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Show "Become Pro" link if:
  // - User is not logged in (tier is null), OR
  // - User is logged in and has "free" tier
  // Hide it if user has "pro" or "lifetime" tier
  const shouldShowBecomePro = !loading && (tier === null || tier === "free");

  return (
    <div className="hidden lg:flex items-center justify-between py-4 transition-all duration-500 ease-out mx-16">
      <div className="flex items-center gap-4">
        <HamburgerButton
          isOpen={isMenuOpen}
          onClick={onMenuToggle}
          variant="desktop"
        />
        <Logo variant="desktop" />
        <CategoriesNav
          categories={categories}
          onCategoryClick={onCategoryClick}
        />
      </div>
      <div className="flex items-center gap-2">
        {shouldShowBecomePro && (
          <Link
            href="/pricing"
            className="text-red-600 font-semibold font-sans text-sm hover:underline transition-colors"
          >
            Become Pro
          </Link>
        )}
        <SearchButton onClick={onMenuToggle} variant="desktop" />
        <UserMenu variant="desktop" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserMenuProps {
  variant?: "mobile" | "desktop";
}

function getUserInitials(
  user: User | null,
  firstName?: string | null,
  lastName?: string | null
) {
  if (!user) return "U";

  if (firstName || lastName) {
    const first = firstName?.[0]?.toUpperCase() || "";
    const last = lastName?.[0]?.toUpperCase() || "";
    if (first || last) return (first + last).slice(0, 2);
  }

  const name = user.user_metadata?.name || user.user_metadata?.full_name;
  if (name) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return user.email?.[0].toUpperCase() || "U";
}

export function UserMenu({ variant = "desktop" }: UserMenuProps) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!mounted) return;

        setFirstName(profile?.first_name ?? null);
        setLastName(profile?.last_name ?? null);
        // Get avatar from user metadata (Google OAuth provides it there)
        setAvatarUrl(
          session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            null
        );
      }

      setLoading(false);
    };

    loadUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .maybeSingle();

        setFirstName(profile?.first_name ?? null);
        setLastName(profile?.last_name ?? null);
        // Get avatar from user metadata (Google OAuth provides it there)
        setAvatarUrl(
          session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture ||
            null
        );
      } else {
        setFirstName(null);
        setLastName(null);
        setAvatarUrl(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try {
      // Server-side signout clears cookies reliably
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        cache: "no-store",
        signal: controller.signal,
      });

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        console.error("Sign out failed:", json?.error || res.statusText);
      }

      // Update local UI immediately
      setUser(null);
      setFirstName(null);
      setLastName(null);
      setAvatarUrl(null);

      // Refresh server components and optionally send to /signin
      router.refresh();
      router.push("/signin");
    } catch (err) {
      console.error("Error signing out:", err);
      // As a fallback, try client signOut (won't hurt)
      try {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/signin");
      } catch (e) {
        console.error("Fallback client signOut failed:", e);
      }
    } finally {
      clearTimeout(t);
      setSigningOut(false);
    }
  };

  const userInitials = getUserInitials(user, firstName, lastName);
  const isMobile = variant === "mobile";

  const buttonSize = isMobile
    ? "h-10 w-10"
    : "transition-all duration-500 ease-out lg:h-8 lg:w-8 h-10 w-10";

  const avatarSize = isMobile
    ? "h-8 w-8"
    : "transition-all duration-500 ease-out lg:h-7 lg:w-7 h-8 w-8";

  if (loading) return null;

  if (!user) {
    return (
      <Button
        asChild
        className="bg-slate-900 text-white hover:bg-slate-800 font-sans"
      >
        <Link href="/signin">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="User menu"
          className={`rounded-full bg-white p-0 flex items-center justify-center hover:bg-gray-100 ${buttonSize}`}
        >
          <Avatar className={avatarSize}>
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={user?.email || "User"} />
            )}
            <AvatarFallback className="bg-white text-neutral-700 text-xs font-sans">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem asChild>
          <Link href="/myprofile" className="font-sans cursor-pointer w-full">
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="font-sans cursor-pointer"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

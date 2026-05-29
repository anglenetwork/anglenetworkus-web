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
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { UserMenuSkeleton } from "./user-menu-skeleton";

/** `default` = filled sign-in button; `link` = shadcn link style. */
export type SignInButtonVariant = "default" | "link";

export interface UserMenuProps {
  variant?: "mobile" | "desktop";
  /** Hide Sign in when signed out (e.g. mobile navbar — show in full-screen menu instead). */
  hideSignIn?: boolean;
  /** Only render Sign in when signed out (for full-screen menu). */
  signInOnly?: boolean;
  /** Sign-in control style when signed out. Defaults to filled slate button. */
  signInButtonVariant?: SignInButtonVariant;
  onSignInNavigate?: () => void;
}

function getUserInitials(
  user: User | null,
  firstName?: string | null,
  lastName?: string | null,
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

export function UserMenu({
  variant = "desktop",
  hideSignIn = false,
  signInOnly = false,
  signInButtonVariant = "default",
  onSignInNavigate,
}: UserMenuProps) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarImageStatus, setAvatarImageStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  // Auth session — getSession for initial state; onAuthStateChange for updates only.
  // Avoid DB calls inside the auth callback (Supabase can deadlock).
  useEffect(() => {
    let mounted = true;

    const syncUserFromSession = (session: { user: User } | null) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setAvatarUrl(
        nextUser?.user_metadata?.avatar_url ||
          nextUser?.user_metadata?.picture ||
          null,
      );
      if (!nextUser) {
        setFirstName(null);
        setLastName(null);
      }
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      syncUserFromSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || event === "INITIAL_SESSION") return;
      syncUserFromSession(session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Profile names — separate from auth callback to avoid Supabase auth deadlocks.
  useEffect(() => {
    if (!user) return;

    let mounted = true;

    void supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data: profile }) => {
        if (!mounted) return;
        setFirstName(profile?.first_name ?? null);
        setLastName(profile?.last_name ?? null);
      });

    return () => {
      mounted = false;
    };
  }, [supabase, user]);

  useEffect(() => {
    setAvatarImageStatus(avatarUrl ? "loading" : "idle");
  }, [avatarUrl]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        cache: "no-store",
        signal: controller.signal,
      });

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        console.error("Sign out failed:", json?.error || res.statusText);
      }

      setUser(null);
      setFirstName(null);
      setLastName(null);
      setAvatarUrl(null);

      router.refresh();
      router.push("/signin");
    } catch (err) {
      console.error("Error signing out:", err);
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
  const showAvatarInitials =
    !avatarUrl || avatarImageStatus === "error" || avatarImageStatus === "idle";
  const isMobile = variant === "mobile";

  const buttonSize = isMobile
    ? "h-10 w-10"
    : "transition-all duration-500 ease-out lg:h-8 lg:w-8 h-10 w-10";

  const avatarSize = isMobile
    ? "h-8 w-8"
    : "transition-all duration-500 ease-out lg:h-7 lg:w-7 h-8 w-8";

  const renderSignIn = () => {
    const isLink = signInButtonVariant === "link";

    return (
      <Button
        asChild
        variant={isLink ? "link" : "signIn"}
        size={isMobile && !isLink ? "sm" : "default"}
        className={cn(
          "shrink-0",
          isLink &&
            "h-auto justify-start p-0 font-bold text-xl hover:text-primary",
          isMobile &&
            !isLink &&
            "h-9 px-3 font-sans text-xs sm:px-4 sm:text-sm",
        )}
      >
        <Link href="/signin" onClick={onSignInNavigate}>
          Sign in
        </Link>
      </Button>
    );
  };

  if (loading) {
    return <UserMenuSkeleton variant={variant} />;
  }

  if (signInOnly) {
    if (user) return null;
    return <div className="border-border border-b pb-6">{renderSignIn()}</div>;
  }

  if (!user) {
    if (hideSignIn) return null;
    return renderSignIn();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="User menu"
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-white p-0 hover:bg-gray-100",
            buttonSize,
          )}
        >
          <Avatar className={avatarSize}>
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt={user.email || "User"}
                onLoadingStatusChange={setAvatarImageStatus}
              />
            ) : null}
            <AvatarFallback className="bg-white font-sans text-neutral-700 text-xs">
              {showAvatarInitials ? userInitials : null}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem asChild>
          <Link href="/myprofile" className="w-full cursor-pointer font-sans">
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/myprofile/subscriptions"
            className="w-full cursor-pointer font-sans"
          >
            Subscriptions
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/myprofile/bookmarks"
            className="w-full cursor-pointer font-sans"
          >
            Bookmarks
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/myprofile/newsletters"
            className="w-full cursor-pointer font-sans"
          >
            Newsletters
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer font-sans"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

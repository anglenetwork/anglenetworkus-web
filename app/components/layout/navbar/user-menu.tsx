"use client";

import { useEffect, useMemo, useReducer } from "react";
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
import { initialUserMenuState, userMenuReducer } from "./user-menu-state";

/** `default` = filled sign-in button; `link` = shadcn link style. */
export type SignInButtonVariant = "default" | "link";

export interface UserMenuProps {
  variant?: "mobile" | "desktop";
  /** Hide Subscriptions when IS_SUBSCRIPTION_VISIBLE is not true. */
  showSubscriptions?: boolean;
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

function UserMenuSignInButton({
  isMobile,
  signInButtonVariant,
  onSignInNavigate,
}: {
  isMobile: boolean;
  signInButtonVariant: SignInButtonVariant;
  onSignInNavigate?: () => void;
}) {
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
        isMobile && !isLink && "h-9 px-3 font-sans text-xs sm:px-4 sm:text-sm",
      )}
    >
      <Link href="/signin" onClick={onSignInNavigate}>
        Sign in
      </Link>
    </Button>
  );
}

export function UserMenu({
  variant = "desktop",
  showSubscriptions = false,
  hideSignIn = false,
  signInOnly = false,
  signInButtonVariant = "default",
  onSignInNavigate,
}: UserMenuProps) {
  const supabase = useMemo(() => createClient(), []);
  const [state, dispatch] = useReducer(userMenuReducer, initialUserMenuState);
  const {
    user,
    firstName,
    lastName,
    avatarUrl,
    avatarImageStatus,
    loading,
    signingOut,
  } = state;
  const { refresh, push } = useRouter();

  // Auth session — getSession for initial state; onAuthStateChange for updates only.
  // Avoid DB calls inside the auth callback (Supabase can deadlock).
  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      dispatch({ type: "session_loaded", session });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted || event === "INITIAL_SESSION") return;
      dispatch({ type: "session_sync", session });
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
        dispatch({
          type: "profile_loaded",
          firstName: profile?.first_name ?? null,
          lastName: profile?.last_name ?? null,
        });
      });

    return () => {
      mounted = false;
    };
  }, [supabase, user]);

  const handleSignOut = async () => {
    if (signingOut) return;
    dispatch({ type: "sign_out_start" });

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        cache: "no-store",
        signal: controller.signal,
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        console.error("Sign out failed:", json?.error || res.statusText);
      }

      dispatch({ type: "signed_out" });

      refresh();
      push("/signin");
    } catch (err) {
      console.error("Error signing out:", err);
      try {
        await supabase.auth.signOut();
        dispatch({ type: "signed_out" });
        refresh();
        push("/signin");
      } catch (e) {
        console.error("Fallback client signOut failed:", e);
      }
    } finally {
      clearTimeout(t);
      dispatch({ type: "sign_out_complete" });
    }
  };

  const userInitials = getUserInitials(user, firstName, lastName);
  const showAvatarInitials =
    !avatarUrl || avatarImageStatus === "error" || avatarImageStatus === "idle";
  const isMobile = variant === "mobile";

  const buttonSize = isMobile
    ? "size-10"
    : "transition-all duration-500 ease-out lg:h-8 lg:w-8 size-10";

  const avatarSize = isMobile
    ? "size-8"
    : "transition-all duration-500 ease-out lg:h-7 lg:w-7 size-8";

  if (loading) {
    return <UserMenuSkeleton variant={variant} />;
  }

  if (signInOnly) {
    if (user) return null;
    return (
      <div className="border-border border-b pb-6">
        <UserMenuSignInButton
          isMobile={isMobile}
          signInButtonVariant={signInButtonVariant}
          onSignInNavigate={onSignInNavigate}
        />
      </div>
    );
  }

  if (!user) {
    if (hideSignIn) return null;
    return (
      <UserMenuSignInButton
        isMobile={isMobile}
        signInButtonVariant={signInButtonVariant}
        onSignInNavigate={onSignInNavigate}
      />
    );
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
                onLoadingStatusChange={(status) =>
                  dispatch({ type: "avatar_status", status })
                }
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

        {showSubscriptions ? (
          <DropdownMenuItem asChild>
            <Link
              href="/myprofile/subscriptions"
              className="w-full cursor-pointer font-sans"
            >
              Subscriptions
            </Link>
          </DropdownMenuItem>
        ) : null}

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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  // Use first and last name from profile if available
  if (firstName || lastName) {
    const first = firstName?.[0]?.toUpperCase() || "";
    const last = lastName?.[0]?.toUpperCase() || "";
    if (first || last) {
      return (first + last).slice(0, 2);
    }
  }

  // Try to get name from user metadata
  const name = user.user_metadata?.name || user.user_metadata?.full_name;
  if (name) {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  // Fall back to email first letter
  return user.email?.[0].toUpperCase() || "U";
}

export function UserMenu({ variant = "desktop" }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session and profile
    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile data for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setFirstName(profile.first_name);
          setLastName(profile.last_name);
        }
      }

      setLoading(false);
    };

    loadUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile data for name
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setFirstName(profile.first_name);
          setLastName(profile.last_name);
        } else {
          setFirstName(null);
          setLastName(null);
        }
      } else {
        setFirstName(null);
        setLastName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const userInitials = getUserInitials(user, firstName, lastName);
  const isMobile = variant === "mobile";

  const buttonSize = isMobile
    ? "h-10 w-10"
    : "transition-all duration-500 ease-out lg:h-8 lg:w-8 h-10 w-10";

  const avatarSize = isMobile
    ? "h-8 w-8"
    : "transition-all duration-500 ease-out lg:h-7 lg:w-7 h-8 w-8";

  // Show loading state (optional - can be removed if not needed)
  if (loading) {
    return null;
  }

  // If user is not logged in, show a simple "Sign in" link
  if (!user) {
    return (
      <Link
        href="/signin"
        className="font-sans text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:opacity-80 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  // If user is logged in, show avatar with dropdown menu
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
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  isScrolled?: boolean;
  variant?: "mobile" | "desktop";
}

function getUserInitials(session: {
  user?: { name?: string | null; email?: string | null } | null;
}) {
  if (session.user?.name) {
    return session.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return session.user?.email?.[0].toUpperCase() || "U";
}

export function UserMenu({
  isScrolled = false,
  variant = "desktop",
}: UserMenuProps) {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return null;
  }

  const userInitials = getUserInitials(session);
  const isMobile = variant === "mobile";

  const buttonSize = isMobile
    ? "h-10 w-10"
    : `transition-all duration-500 ease-out ${isScrolled ? "lg:h-8 lg:w-8" : "lg:h-10 lg:w-10"} h-10 w-10`;

  const avatarSize = isMobile
    ? "h-8 w-8"
    : `transition-all duration-500 ease-out ${isScrolled ? "lg:h-7 lg:w-7" : "lg:h-9 lg:w-9"} h-8 w-8`;

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
        <DropdownMenuItem
          className="font-sans cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

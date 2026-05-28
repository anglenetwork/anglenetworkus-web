"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { UserMenuProps } from "./user-menu";

function UserMenuPlaceholder({ variant = "desktop" }: { variant?: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";
  return (
    <div
      className={cn(
        "shrink-0 rounded-full bg-neutral-200",
        isMobile ? "h-10 w-10" : "h-10 w-10 lg:h-8 lg:w-8",
      )}
      aria-hidden
    />
  );
}

const UserMenu = dynamic(
  () => import("./user-menu").then((mod) => ({ default: mod.UserMenu })),
  { ssr: false, loading: () => <UserMenuPlaceholder /> },
);

export function UserMenuSlot(props: UserMenuProps) {
  return <UserMenu {...props} />;
}

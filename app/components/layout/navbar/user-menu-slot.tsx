"use client";

import dynamic from "next/dynamic";
import type { UserMenuProps } from "./user-menu";
import { UserMenuSkeleton } from "./user-menu-skeleton";

const UserMenu = dynamic(
  () => import("./user-menu").then((mod) => mod.UserMenu),
  {
    ssr: false,
    loading: () => <UserMenuSkeleton />,
  },
);

export function UserMenuSlot(props: UserMenuProps) {
  return <UserMenu {...props} />;
}

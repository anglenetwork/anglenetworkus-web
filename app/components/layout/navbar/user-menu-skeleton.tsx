import { cn } from "@/lib/utils";
import type { UserMenuProps } from "./user-menu";

/** Matches the signed-in avatar trigger: white circle with a light border. */
function userMenuCircleClass(variant: UserMenuProps["variant"] = "desktop") {
  return cn(
    "shrink-0 rounded-full border border-neutral-200 bg-white",
    variant === "mobile" ? "size-10" : "size-10 lg:h-8 lg:w-8",
  );
}

export function UserMenuSkeleton({
  variant = "desktop",
}: {
  variant?: UserMenuProps["variant"];
}) {
  return (
    <div
      className={userMenuCircleClass(variant)}
      aria-hidden
      aria-label="Loading user menu"
    />
  );
}

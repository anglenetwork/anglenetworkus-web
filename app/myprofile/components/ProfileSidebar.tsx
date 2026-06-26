"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bookmark, CreditCard, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  profileSidebarNavLink,
  profileSidebarNavLinkMobile,
} from "@/app/lib/typography/myprofile-page";

const navigation = [
  { name: "Profile", href: "/myprofile/profile-details", icon: User },
  { name: "Bookmarks", href: "/myprofile/bookmarks", icon: Bookmark },
  { name: "Subscriptions", href: "/myprofile/subscriptions", icon: CreditCard },
  {
    name: "Newsletters",
    href: "/myprofile/newsletters",
    icon: Mail,
  },
];

export function ProfileSidebar({
  showSubscriptions = false,
}: {
  showSubscriptions?: boolean;
}) {
  const pathname = usePathname();

  const items = showSubscriptions
    ? navigation
    : navigation.filter((item) => item.href !== "/myprofile/subscriptions");

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-border border-r bg-background xl:flex">
        <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
          <nav className="flex-1 space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    profileSidebarNavLink,
                    isActive ? "bg-accent" : "hover:bg-accent",
                  )}
                >
                  <Icon className="size-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile/Tablet Navigation */}
      <div className="w-full xl:hidden">
        <nav className="sticky top-0 flex gap-2 overflow-x-auto border-border border-b bg-background px-4 py-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className={cn(
                  profileSidebarNavLinkMobile,
                  isActive ? "bg-accent" : "hover:bg-accent",
                )}
              >
                <Icon className="size-4" />
                {isActive ? <span>{item.name}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

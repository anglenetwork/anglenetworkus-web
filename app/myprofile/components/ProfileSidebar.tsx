"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bookmark, CreditCard, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-border border-r bg-background md:flex">
        <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
          <nav className="flex-1 space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 font-medium font-sans text-base transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground "
                      : "text-muted-foreground hover:bg-accent hover:text-foreground text-black",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile/Tablet Navigation */}
      <div className="w-full md:hidden">
        <nav className="sticky top-0 flex gap-2 overflow-x-auto border-border border-b bg-background px-4 py-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className={cn(
                  "flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 font-medium font-sans text-xs transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

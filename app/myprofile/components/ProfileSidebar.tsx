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
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white h-screen sticky top-0">
        <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col">
          <nav className="space-y-0.5 flex-1">
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
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg font-sans",
                    isActive
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
      <div className="md:hidden w-full">
        <nav className="flex gap-2 border-b border-slate-200 bg-white px-4 py-3 overflow-x-auto sticky top-0">
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
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 font-sans",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50"
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Profile", href: "/myprofile/profile-details" },
  { name: "Bookmarks", href: "/myprofile/bookmarks" },
  { name: "Subscriptions", href: "/myprofile/subscriptions" },
  { name: "Newsletter Preferences", href: "/myprofile/newsletters" },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64">
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={false}
              className={cn(
                "block px-4 py-3 text-sm font-medium rounded-md transition-colors font-sans",
                isActive
                  ? "bg-neutral-100 text-neutral-900 font-semibold"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

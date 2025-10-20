"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { HeaderClient } from "./header-client";
import { Footer } from "./footer";

interface Category {
  slug: string;
  name: string;
}

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  categories: Category[];
}

export function MainLayoutWrapper({
  children,
  categories,
}: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  return (
    <div className="min-h-screen bg-white border-2 border-orange-400">
      {!isStudioRoute && <HeaderClient categories={categories} />}
      {children}
      {!isStudioRoute && <Footer />}
    </div>
  );
}

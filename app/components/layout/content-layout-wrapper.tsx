"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { HeaderClient } from "./header-client";
import { Footer } from "./footer";

interface Category {
  slug: string;
  name: string;
  views?: number;
}

interface Tag {
  slug: string;
  title: string;
  views?: number;
}

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  categories: Category[];
  tags: Tag[];
  showsTags: Tag[];
}

export function MainLayoutWrapper({
  children,
  categories,
  tags,
  showsTags,
}: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  return (
    <div className="min-h-screen bg-white border-2 border-orange-400">
      {!isStudioRoute && (
        <HeaderClient
          categories={categories}
          tags={tags}
          showsTags={showsTags}
        />
      )}
      {children}
      {!isStudioRoute && <Footer categories={categories} tags={tags} />}
    </div>
  );
}

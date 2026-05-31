import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import StudioClient from "./StudioClient";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Sanity Studio",
    "Content management studio for The Angle editorial team.",
    "/studio",
    { private: true },
  );
}

// Must be dynamic to check session on each request
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Not logged in (NextAuth)
    redirect("/logineditor");
  }

  // Render NextStudio on client side only to avoid hydration mismatches
  // with styled-components class names
  return <StudioClient />;
}

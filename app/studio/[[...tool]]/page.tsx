import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";
import StudioClient from "../StudioClient";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Sanity Studio",
    "Content management studio for The Angle editorial team.",
    "/studio",
    { private: true },
  );
}

// Per-request session check; must not be force-static.
export const dynamic = "force-dynamic";

export default async function StudioToolPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/logineditor");
  }

  return <StudioClient />;
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NextStudio } from "next-sanity/studio";

import { authOptions } from "@/app/lib/auth";
import config from "@/sanity.config";

// Must be dynamic to check session on each request
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Not logged in (NextAuth)
    redirect("/login");
  }

  // If signIn callback passed, this email is already validated against author docs
  return <NextStudio config={config} />;
}

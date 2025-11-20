import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { NextStudio } from "next-sanity/studio";

import { authOptions } from "@/app/lib/auth";
import config from "@/sanity.config";

// Must be dynamic to check session on each request
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // User not logged in – send to login page with callback URL
    redirect("/login?callbackUrl=/studio");
  }

  // Extra safety: ensure it's REALLY you
  if (session.user?.email !== "myvisualdna@gmail.com") {
    redirect("/"); // or a 403 page
  }

  return <NextStudio config={config} />;
}

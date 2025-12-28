import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth";
import StudioClient from "./StudioClient";

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

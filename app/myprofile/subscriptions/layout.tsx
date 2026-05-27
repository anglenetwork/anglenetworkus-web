import type { ReactNode } from "react";
import { SupabaseAuthProvider } from "@/app/providers/SupabaseAuthProvider";

export default function SubscriptionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}

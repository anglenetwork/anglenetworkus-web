import type { ReactNode } from "react";
import { SupabaseAuthProvider } from "@/app/providers/SupabaseAuthProvider";

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}

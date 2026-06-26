import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SupabaseAuthProvider } from "@/app/providers/SupabaseAuthProvider";
import { isSubscriptionVisible } from "@/lib/subscriptions/is-subscription-visible";

export default function SubscriptionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isSubscriptionVisible()) {
    redirect("/myprofile/profile-details");
  }

  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}

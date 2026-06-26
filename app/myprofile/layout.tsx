import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSubscriptionVisible } from "@/lib/subscriptions/is-subscription-visible";
import { SignInForm } from "./components/SignInForm";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { profileCardTitle } from "@/app/lib/typography/myprofile-page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const showSubscriptions = isSubscriptionVisible();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 xl:py-12">
        <Card>
          <CardHeader>
            <CardTitle className={profileCardTitle}>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 xl:py-12">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <ProfileSidebar showSubscriptions={showSubscriptions} />
        </div>
        <div className="xl:col-span-3">{children}</div>
      </div>
    </div>
  );
}

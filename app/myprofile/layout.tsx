import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSubscriptionVisible } from "@/lib/subscriptions/is-subscription-visible";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
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
      <SitePageWidth className="py-8 xl:py-12">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className={profileCardTitle}>Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <SignInForm />
            </CardContent>
          </Card>
        </div>
      </SitePageWidth>
    );
  }

  return (
    <SitePageWidth className="py-8 xl:py-12">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <ProfileSidebar showSubscriptions={showSubscriptions} />
        </div>
        <div className="xl:col-span-3">{children}</div>
      </div>
    </SitePageWidth>
  );
}

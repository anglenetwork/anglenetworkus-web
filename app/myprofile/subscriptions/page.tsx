import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SubscriptionPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans text-2xl">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground font-sans">
            Your subscription information will be displayed here.
          </p>
          <div className="space-y-2">
            <p className="font-sans text-sm">
              <span className="font-medium">Status:</span> Active
            </p>
            <p className="font-sans text-sm">
              <span className="font-medium">Plan:</span> Premium
            </p>
            <p className="font-sans text-sm">
              <span className="font-medium">Next Billing Date:</span> Coming soon
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


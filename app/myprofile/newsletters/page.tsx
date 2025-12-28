import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewsletterToggles } from "../components/NewsletterToggles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewslettersPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-sans text-2xl">
          Newsletter Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NewsletterToggles userId={user.id} />
      </CardContent>
    </Card>
  );
}

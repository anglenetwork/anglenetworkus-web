import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewsletterToggles } from "../components/NewsletterToggles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewslettersPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2 font-sans">
          Newsletters
        </h1>
        <p className="text-slate-600 font-sans">
          Choose which newsletters you'd like to receive
        </p>
      </div>

      <NewsletterToggles userId={user.id} />

      <div className="mt-12 p-4 rounded-lg border border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-700 font-sans">
          You can manage your email preferences at any time. We'll only send you
          the newsletters you've opted in to receive.
        </p>
      </div>
    </div>
  );
}

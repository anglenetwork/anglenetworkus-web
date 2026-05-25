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
        <h1 className="mb-2 font-sans font-semibold text-3xl text-slate-900">
          Newsletters
        </h1>
        <p className="font-sans text-slate-600">
          Choose which newsletters you&apos;d like to receive
        </p>
      </div>

      <NewsletterToggles />

      <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="font-sans text-slate-700 text-sm">
          You can manage your email preferences at any time. We&apos;ll only
          send you the newsletters you&apos;ve opted in to receive.
        </p>
      </div>
    </div>
  );
}

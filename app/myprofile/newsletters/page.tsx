import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewsletterToggles } from "../components/NewsletterToggles";
import { ProfileSectionHeader } from "../components/ProfileSectionHeader";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Newsletter Preferences",
    "Choose which email newsletters you receive from The Angle.",
    "/myprofile/newsletters",
    { private: true },
  );
}

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
      <ProfileSectionHeader
        title="Newsletters"
        description="Choose which newsletters you'd like to receive"
      />

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

import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileDetailsClient from "./ProfileDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfileDetailsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Layout already handles sign-in, but keep a safe fallback
    return null;
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("first_name, last_name, date_of_birth, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <ProfileDetailsClient
      userId={user.id}
      email={profileData?.email ?? user.email ?? null}
      profile={profileData ?? null}
    />
  );
}

import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileDetailsClient from "./ProfileDetailsClient";
import type { User } from "@supabase/supabase-js";
import { staticPageMetadata } from "@/app/lib/seo/static-page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(
    "Profile Details",
    "Manage your account profile and personal information.",
    "/myprofile/profile-details",
    { private: true },
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getNamePrefillFromAuthUser(user: User): {
  firstName: string | null;
  lastName: string | null;
} {
  // Try given_name and family_name first (Google OAuth)
  if (user.user_metadata?.given_name && user.user_metadata?.family_name) {
    return {
      firstName: user.user_metadata.given_name,
      lastName: user.user_metadata.family_name,
    };
  }

  // Try full_name and parse
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.display_name;

  if (fullName) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length > 0) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" ") || null,
      };
    }
  }

  // No name found in metadata
  return { firstName: null, lastName: null };
}

export default async function ProfileDetailsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Layout already handles sign-in, but keep a safe fallback
    return null;
  }

  // Log the user UID
  console.log("User UID:", user.id);

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("first_name, last_name, date_of_birth")
    .eq("id", user.id)
    .maybeSingle();

  // Log the query result
  console.log("Profile query result:", {
    data: profileData,
    error: profileError,
    queryUserId: user.id,
  });

  // Get name prefill from auth metadata (for modal)
  const namePrefill = getNamePrefillFromAuthUser(user);

  return (
    <ProfileDetailsClient
      userId={user.id}
      email={user.email ?? null}
      profile={profileData ?? null}
      namePrefill={namePrefill}
    />
  );
}

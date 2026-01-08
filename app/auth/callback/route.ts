import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");
  
  // Default to profile-details with post_login flag
  let next = nextParam ?? "/myprofile/profile-details?post_login=1";
  
  // If next param exists but doesn't have post_login, append it
  if (nextParam && !nextParam.includes("post_login")) {
    const separator = nextParam.includes("?") ? "&" : "?";
    next = `${nextParam}${separator}post_login=1`;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 }
    );
  }

  // Get cookies - handle both sync and async versions
  const cookieStoreAny: any = cookies();
  const cookieStore =
    typeof cookieStoreAny?.then === "function"
      ? await cookieStoreAny
      : cookieStoreAny;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  if (code) {
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
      // Redirect to sign-in page with error
      return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(error.message)}`, url));
    }

    // Ensure profile row exists for all authentication methods (OAuth and email magic link)
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user after authentication:", userError);
        // Continue to redirect even if profile creation fails
      } else {
        // Check if this is an OAuth provider (has provider metadata)
        const isOAuth = user.app_metadata?.provider && user.app_metadata.provider !== "email";
        const hasOAuthMetadata = 
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.user_metadata?.given_name ||
          user.user_metadata?.family_name;

        // Build profile update object
        const profileUpdate: {
          id: string;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          updated_at: string;
        } = {
          id: user.id,
          updated_at: new Date().toISOString(),
        };

        // Set email if available
        if (user.email) {
          profileUpdate.email = user.email;
        }

        // For OAuth providers (like Google), extract and set name data from metadata
        if (isOAuth && hasOAuthMetadata) {
          // Log user metadata for debugging
          console.log("User metadata from OAuth provider:", JSON.stringify(user.user_metadata, null, 2));

          // Extract OAuth metadata - check multiple possible field names
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.display_name ||
            (user.user_metadata?.given_name && user.user_metadata?.family_name
              ? `${user.user_metadata.given_name} ${user.user_metadata.family_name}`.trim()
              : null);

          // Parse full_name into first_name and last_name
          let firstName: string | null = null;
          let lastName: string | null = null;
          
          if (fullName) {
            const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
            if (nameParts.length > 0) {
              firstName = nameParts[0];
              if (nameParts.length > 1) {
                lastName = nameParts.slice(1).join(" ");
              }
            }
          } else {
            // Fallback: try to get given_name and family_name directly
            if (user.user_metadata?.given_name) {
              firstName = user.user_metadata.given_name;
            }
            if (user.user_metadata?.family_name) {
              lastName = user.user_metadata.family_name;
            }
          }

          // Set first_name if we parsed it from OAuth data
          if (firstName) {
            profileUpdate.first_name = firstName;
          }

          // Set last_name if we parsed it from OAuth data
          if (lastName) {
            profileUpdate.last_name = lastName;
          }

          // Note: avatar_url is available from user.user_metadata.avatar_url or user.user_metadata.picture
          // It's not stored in the profiles table
        }
        // For email magic link, profile will be created with just id and email
        // User can fill in first_name, last_name, date_of_birth via the profile completion modal

        // Log what we're about to upsert
        console.log("Upserting profile:", JSON.stringify(profileUpdate, null, 2));

        // Upsert profile - this will create the profile if it doesn't exist, or update it if it does
        // This ensures a profile row exists for all users (OAuth and email magic link)
        const { error: profileError, data: updatedProfile } = await supabase
          .from("profiles")
          .upsert(profileUpdate, { onConflict: "id" })
          .select();

        if (profileError) {
          console.error("Error upserting profile:", profileError);
          // Don't block auth flow if profile upsert fails
        } else {
          console.log("Profile upserted successfully:", JSON.stringify(updatedProfile, null, 2));
          
          // Ensure free tier entitlement exists (idempotent)
          // This provides app-level guarantee in addition to the database trigger
          const { error: tierError } = await supabase.rpc("ensure_free_tier");
          if (tierError) {
            console.error("Error ensuring free tier:", tierError);
            // Don't block auth flow if tier creation fails (trigger should handle it)
          }
        }
      }
    } catch (profileErr) {
      console.error("Error ensuring profile exists:", profileErr);
      // Continue to redirect even if profile creation fails
    }
  }

  // Redirect to the next URL (defaults to /myprofile)
  return NextResponse.redirect(new URL(next, url));
}



import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  safeRelativeRedirectPath,
  withPostLoginFlag,
} from "@/lib/safe-redirect-path";

const AUTH_CALLBACK_DEFAULT = "/myprofile/profile-details?post_login=1";

function getSupabaseEnv() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { supabaseUrl, supabaseAnonKey };
}

async function getCookieStore() {
  const cookieStoreAny: any = cookies();
  return typeof cookieStoreAny?.then === "function"
    ? await cookieStoreAny
    : cookieStoreAny;
}

function safeAuthCallbackPath(nextParam: string | null | undefined): string {
  return withPostLoginFlag(
    safeRelativeRedirectPath(nextParam, {
      defaultPath: AUTH_CALLBACK_DEFAULT,
    }),
  );
}

function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function authCallbackBridgeHtml(code: string, next: string): string {
  const safeCode = htmlEscape(code);
  const safeNext = htmlEscape(next);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Completing sign in…</title>
  </head>
  <body>
    <form id="auth-callback-form" method="POST" action="/auth/callback">
      <input type="hidden" name="code" value="${safeCode}" />
      <input type="hidden" name="next" value="${safeNext}" />
    </form>
    <script>
      document.getElementById("auth-callback-form").submit();
    </script>
    <noscript>
      <p>JavaScript is required to complete sign in.</p>
      <button type="submit" form="auth-callback-form">Continue</button>
    </noscript>
  </body>
</html>`;
}

async function ensureProfileAndSubscription(
  supabase: SupabaseClient,
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user after authentication:", userError);
    return;
  }

  const isOAuth =
    user.app_metadata?.provider && user.app_metadata.provider !== "email";
  const hasOAuthMetadata =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.display_name ||
    user.user_metadata?.given_name ||
    user.user_metadata?.family_name;

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

  if (user.email) {
    profileUpdate.email = user.email;
  }

  if (isOAuth && hasOAuthMetadata) {
    console.log(
      "User metadata from OAuth provider:",
      JSON.stringify(user.user_metadata, null, 2),
    );

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.display_name ||
      (user.user_metadata?.given_name && user.user_metadata?.family_name
        ? `${user.user_metadata.given_name} ${user.user_metadata.family_name}`.trim()
        : null);

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
      if (user.user_metadata?.given_name) {
        firstName = user.user_metadata.given_name;
      }
      if (user.user_metadata?.family_name) {
        lastName = user.user_metadata.family_name;
      }
    }

    if (firstName) {
      profileUpdate.first_name = firstName;
    }

    if (lastName) {
      profileUpdate.last_name = lastName;
    }
  }

  console.log("Upserting profile:", JSON.stringify(profileUpdate, null, 2));

  const { error: profileError, data: updatedProfile } = await supabase
    .from("profiles")
    .upsert(profileUpdate, { onConflict: "id" })
    .select();

  if (profileError) {
    console.error("Error upserting profile:", profileError);
    return;
  }

  console.log(
    "Profile upserted successfully:",
    JSON.stringify(updatedProfile, null, 2),
  );

  const { error: tierError } = await supabase.rpc("ensure_subscription_row");
  if (tierError) {
    console.error("Error ensuring subscription row:", tierError);
  }
}

/** GET: no cookie writes — OAuth providers must land here, then auto-POST to complete. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = safeAuthCallbackPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL(nextPath, url.origin));
  }

  return new NextResponse(authCallbackBridgeHtml(code, nextPath), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** POST: exchange OAuth/magic-link code and set session cookies. */
export async function POST(request: Request) {
  const url = new URL(request.url);

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const code = formData.get("code");
  const nextRaw = formData.get("next");
  const nextPath = safeAuthCallbackPath(
    typeof nextRaw === "string" ? nextRaw : null,
  );

  if (typeof code !== "string" || code.trim() === "") {
    return NextResponse.redirect(
      new URL("/signin?error=missing_auth_code", url.origin),
    );
  }

  const cookieStore = await getCookieStore();

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code for session:", error);
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(error.message)}`, url.origin),
    );
  }

  try {
    await ensureProfileAndSubscription(supabase);
  } catch (profileErr) {
    console.error("Error ensuring profile exists:", profileErr);
  }

  return NextResponse.redirect(new URL(nextPath, url.origin));
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/myprofile";

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
  }

  // Redirect to the next URL (defaults to /myprofile)
  return NextResponse.redirect(new URL(next, url));
}



import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // 1) update request cookies (so server components in this request see the refreshed tokens)
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        // 2) create a new response and set cookies on it (so the browser stores refreshed tokens)
        response = NextResponse.next({ request });
        cookiesToSet.forEach(
          ({
            name,
            value,
            options,
          }: {
            name: string;
            value: string;
            options?: CookieOptions;
          }) => {
            response.cookies.set(name, value, options);
          },
        );
      },
    },
  });

  // This call refreshes tokens if needed and keeps cookies in sync.
  // (Docs mention getUser/getClaims depending on guide version.)
  if (typeof (supabase.auth as any).getClaims === "function") {
    await (supabase.auth as any).getClaims();
  } else {
    await supabase.auth.getUser();
  }

  return response;
}

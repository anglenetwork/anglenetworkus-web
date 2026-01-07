import { chromium, type FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

/**
 * Playwright global setup:
 * - Creates (or reuses) a confirmed Supabase user
 * - Generates a Supabase magic link via Admin API (service role)
 * - Visits the link in a real browser to establish a session
 * - Saves storage state to playwright/.auth/state.json
 *
 * Required env vars (Node-only):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY   (secret, NEVER expose client-side)
 * - PLAYWRIGHT_TEST_EMAIL
 *
 * Optional:
 * - PLAYWRIGHT_TEST_BASE_URL (defaults to http://localhost:3000)
 * - PLAYWRIGHT_POST_LOGIN_PATH (defaults to /myprofile)
 */
export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000";
  const postLoginPath = process.env.PLAYWRIGHT_POST_LOGIN_PATH ?? "/myprofile";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;

  if (!supabaseUrl) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  if (!email) throw new Error("Missing env: PLAYWRIGHT_TEST_EMAIL");

  // Admin client (service role) - Node-only
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Ensure user exists and is confirmed (so no mailbox reading is needed)
  const created = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  // If the user already exists, ignore that error and continue
  if (created.error) {
    const msg = String(created.error.message || "").toLowerCase();
    const alreadyExists =
      msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("registered") ||
      msg.includes("duplicate");

    if (!alreadyExists) throw created.error;
  }

  // Generate a REAL magic link that redirects back to your app callback
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      // Must be allowed in Supabase Auth Redirect URLs
      redirectTo: `${baseURL}/auth/callback`,
    },
  });

  if (error) throw error;

  const actionLink = data?.properties?.action_link;
  if (!actionLink) throw new Error("No action_link returned from Supabase generateLink");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Visiting the actionLink should log in and redirect to your app
  await page.goto(actionLink, { waitUntil: "load" });

  // Wait for redirect - the callback redirects to /myprofile/profile-details?post_login=1 by default
  // Use a more flexible URL pattern to handle the actual redirect
  await page.waitForURL(
    (url) => {
      const pathname = new URL(url).pathname;
      return pathname.startsWith("/myprofile");
    },
    { timeout: 60_000 }
  );

  // Save authenticated browser state for all tests
  await page.context().storageState({ path: "playwright/.auth/state.json" });

  await browser.close();
}


import { chromium, type FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables
dotenv.config({ path: resolve(__dirname, "../.env.local") });

/**
 * Playwright global setup using direct session injection:
 * - Creates (or reuses) a confirmed Supabase user
 * - Gets a session token directly from Supabase
 * - Injects session into browser localStorage (which Playwright can capture)
 * - Saves storage state to playwright/.auth/state.json
 *
 * Required env vars (Node-only):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY   (secret, NEVER expose client-side)
 * - PLAYWRIGHT_TEST_EMAIL
 *
 * Optional:
 * - PLAYWRIGHT_TEST_BASE_URL (defaults to http://localhost:3000)
 */
export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.PLAYWRIGHT_TEST_EMAIL;

  if (!supabaseUrl) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  if (!email) throw new Error("Missing env: PLAYWRIGHT_TEST_EMAIL");

  console.log("🔐 Setting up authentication for Playwright tests...");

  // Admin client (service role) - Node-only
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Ensure user exists and is confirmed
  console.log(`Creating/verifying user: ${email}`);
  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  let userId: string;
  if (createError) {
    const msg = String(createError.message || "").toLowerCase();
    const alreadyExists =
      msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("registered") ||
      msg.includes("duplicate");

    if (!alreadyExists) throw createError;
    
    // User exists, get it by listing users
    console.log("User already exists, fetching user data...");
    const { data: users, error: listError } = await admin.auth.admin.listUsers();
    if (listError) throw listError;
    const existingUser = users?.users?.find(u => u.email === email);
    if (!existingUser) throw new Error(`Could not find user: ${email}`);
    userId = existingUser.id;
  } else {
    userId = userData?.user?.id!;
  }

  console.log(`✅ User ready: ${userId}`);

  // Generate a session token for the user
  console.log("Generating session token...");
  const { data: sessionData, error: sessionError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${baseURL}/auth/callback`,
    },
  });

  if (sessionError) throw new Error(`Failed to generate session: ${sessionError.message}`);

  const actionLink = sessionData?.properties?.action_link;
  if (!actionLink) throw new Error("No action_link returned from Supabase");

  // Launch browser to visit magic link and extract tokens from redirect
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Visiting magic link to get tokens...");
  // Visit the magic link - it will redirect to our callback with tokens
  await page.goto(actionLink, { waitUntil: "networkidle", timeout: 30000 });

  // Wait for redirect to callback URL
  await page.waitForURL(
    (url) => url.pathname === "/auth/callback" || url.pathname.startsWith("/myprofile"),
    { timeout: 30000 }
  );

  // Extract tokens from URL hash (Supabase puts them there after redirect)
  const currentUrl = page.url();
  console.log(`Current URL after redirect: ${currentUrl.substring(0, 100)}...`);

  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expiresAt: string | null = null;
  let expiresIn = "3600";

  // Try to extract from hash
  if (currentUrl.includes("#")) {
    const hash = currentUrl.split("#")[1];
    const params = new URLSearchParams(hash);
    accessToken = params.get("access_token");
    refreshToken = params.get("refresh_token");
    expiresAt = params.get("expires_at");
    expiresIn = params.get("expires_in") || "3600";
  }

  // If not in hash, try query params
  if (!accessToken) {
    const url = new URL(currentUrl);
    accessToken = url.searchParams.get("access_token");
    refreshToken = url.searchParams.get("refresh_token");
    expiresAt = url.searchParams.get("expires_at");
  }

  // If still no tokens, try to get them from the page's localStorage (Supabase client might have stored them)
  if (!accessToken) {
    console.log("Tokens not in URL, checking localStorage...");
    const storedSession = await page.evaluate(() => {
      // Check all localStorage keys that might contain Supabase session
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("auth-token") || key.includes("sb-"))) {
          try {
            const value = JSON.parse(localStorage.getItem(key) || "{}");
            if (value.access_token) {
              return { key, value };
            }
          } catch (e) {
            // Not JSON, skip
          }
        }
      }
      return null;
    });

    if (storedSession?.value) {
      accessToken = storedSession.value.access_token;
      refreshToken = storedSession.value.refresh_token;
      expiresAt = storedSession.value.expires_at?.toString();
    }
  }

  if (!accessToken || !refreshToken || !expiresAt) {
    // Last resort: navigate to callback and wait for Supabase to process
    console.log("Waiting for Supabase to process authentication...");
    await page.waitForTimeout(3000);
    
    // Check localStorage again after wait
    const storedSession = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes("auth-token") || key.includes("sb-"))) {
          try {
            const value = JSON.parse(localStorage.getItem(key) || "{}");
            if (value.access_token) {
              return { key, value };
            }
          } catch (e) {
            // Not JSON, skip
          }
        }
      }
      return null;
    });

    if (storedSession?.value) {
      accessToken = storedSession.value.access_token;
      refreshToken = storedSession.value.refresh_token;
      expiresAt = storedSession.value.expires_at?.toString();
    } else {
      throw new Error("Could not extract tokens from magic link or localStorage. URL: " + currentUrl.substring(0, 200));
    }
  }

  console.log("✅ Tokens extracted successfully");

  // Get user details for the session payload
  const { data: userDetails } = await admin.auth.admin.getUserById(userId);
  const user = userDetails?.user;

  if (!user) {
    throw new Error(`Could not fetch user details for ${userId}`);
  }

  // Construct the session payload in the format Supabase expects
  if (!expiresAt) {
    throw new Error("expiresAt is required but was null");
  }
  
  const sessionPayload = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: parseInt(expiresAt, 10),
    expires_in: parseInt(expiresIn, 10),
    token_type: "bearer",
    user: {
      id: user.id,
      aud: user.aud || "authenticated",
      email: user.email,
      email_confirmed_at: user.email_confirmed_at || new Date().toISOString(),
      phone: user.phone || "",
      confirmed_at: user.confirmed_at || new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: user.app_metadata || {},
      user_metadata: user.user_metadata || {},
      identities: user.identities || [],
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  // Determine the localStorage key format
  // Supabase uses: sb-{project-ref}-auth-token
  // Project ref is extracted from the URL
  const projectRef = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] || 
                     supabaseUrl.replace(/[^a-zA-Z0-9]/g, "_");
  const storageKey = `sb-${projectRef}-auth-token`;

  console.log(`Injecting session into localStorage with key: ${storageKey}`);

  // Set the session in localStorage using the browser context
  // Stringify the payload before passing to evaluate (it needs to be serializable)
  const sessionPayloadString = JSON.stringify(sessionPayload);
  await page.evaluate(
    ([key, valueStr]) => {
      localStorage.setItem(key, valueStr);
      // Also trigger a storage event so Supabase client picks it up
      window.dispatchEvent(new StorageEvent("storage", {
        key,
        newValue: valueStr,
        storageArea: localStorage,
      }));
    },
    [storageKey, sessionPayloadString]
  );

  console.log("✅ Session injected into localStorage");

  // Also set cookies for server-side middleware
  // Supabase SSR uses these cookie names
  const url = new URL(baseURL);
  const domain = url.hostname || "localhost";
  const cookieDomain = domain === "localhost" ? "localhost" : `.${domain}`;
  
  await context.addCookies([
    {
      name: `sb-${projectRef}-auth-token`,
      value: JSON.stringify(sessionPayload),
      domain: cookieDomain,
      path: "/",
      httpOnly: false, // Must be false for client-side access
      secure: baseURL.startsWith("https"),
      sameSite: "Lax" as const,
    },
    {
      name: `sb-${projectRef}-auth-token-code-verifier`,
      value: "",
      domain: cookieDomain,
      path: "/",
      httpOnly: false,
      secure: baseURL.startsWith("https"),
      sameSite: "Lax" as const,
    },
  ]);

  console.log("✅ Cookies set for server-side middleware");

  // Verify the session works by navigating to a protected page
  console.log("Verifying authentication...");
  await page.goto(`${baseURL}/myprofile`, { waitUntil: "networkidle", timeout: 30000 });

  // Wait for profile content to appear (confirms auth worked)
  try {
    await page.waitForSelector('text=/profile|email|subscriptions|bookmarks/i', { timeout: 15000 });
    console.log("✅ Authentication verified - profile content visible");
  } catch (error) {
    // Check if we're still on signin page
    const currentUrl = page.url();
    if (currentUrl.includes("/signin")) {
      console.error("❌ Authentication failed - still on signin page");
      const pageText = await page.textContent("body");
      console.error(`Page content: ${pageText?.substring(0, 300)}`);
      throw new Error("Authentication failed - user was not authenticated");
    }
    console.warn("⚠️  Profile content not immediately visible, but session is set");
  }

  // Save storage state (this will include localStorage)
  const fs = await import("fs");
  const path = await import("path");
  const statePath = "playwright/.auth/state.json";
  const stateDir = path.dirname(statePath);
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }

  await context.storageState({ path: statePath });
  
  // Verify what was saved
  const savedState = JSON.parse(fs.readFileSync(statePath, "utf-8"));
  const hasLocalStorage = savedState.origins?.some((origin: any) => 
    origin.localStorage?.some((item: any) => 
      item.name.includes("auth-token") || item.name.includes("sb-")
    )
  );
  
  console.log(`📦 Storage state saved:`);
  console.log(`   Cookies: ${savedState.cookies?.length || 0}`);
  console.log(`   Origins: ${savedState.origins?.length || 0}`);
  console.log(`   Auth token in localStorage: ${hasLocalStorage ? "✅ Yes" : "❌ No"}`);
  
  if (hasLocalStorage) {
    const authItem = savedState.origins
      .find((o: any) => o.origin === baseURL)
      ?.localStorage
      ?.find((item: any) => item.name.includes("auth-token") || item.name.includes("sb-"));
    if (authItem) {
      console.log(`   Storage key: ${authItem.name}`);
    }
  }

  await browser.close();
  console.log("✅ Global setup complete!");
}

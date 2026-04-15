import { chromium, type FullConfig } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve } from "path";

import { ensurePlaywrightTestUser } from "./supabase-test-user";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "PLAYWRIGHT_TEST_EMAIL",
  "PLAYWRIGHT_TEST_PASSWORD",
] as const;

function getPublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

function validateEnv(): {
  supabaseUrl: string;
  serviceRoleKey: string;
  email: string;
  password: string;
  publishableKey: string;
} {
  const missing = REQUIRED.filter((k) => !process.env[k]?.trim());
  if (missing.length) {
    console.error(
      "[Playwright global-setup] Missing required environment variables:",
      missing.join(", ")
    );
    throw new Error(
      `Missing required env: ${missing.join(", ")}. Set them in .env.local (see README).`
    );
  }

  const publishableKey = getPublishableKey();
  if (!publishableKey) {
    console.error(
      "[Playwright global-setup] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (needed for password sign-in after admin provisioning)."
    );
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const email = process.env.PLAYWRIGHT_TEST_EMAIL!.trim();
  const password = process.env.PLAYWRIGHT_TEST_PASSWORD!;

  console.log("[Playwright global-setup] Env validation: OK (service role + test user + publishable key present)");

  return { supabaseUrl, serviceRoleKey, email, password, publishableKey };
}

/**
 * Global setup: provision test user via admin API, sign in with password (anon client),
 * inject session into the browser, save storage state for tests.
 */
export default async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000";
  const { supabaseUrl, serviceRoleKey, email, password, publishableKey } = validateEnv();

  console.log("[Playwright global-setup] Provisioning test user with Supabase service role (admin API)…");

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { userId, action } = await ensurePlaywrightTestUser(admin, email, password);
  console.log(
    `[Playwright global-setup] Test user ${action === "created" ? "created" : "updated"}: ${email} (id=${userId})`
  );

  const userClient = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("[Playwright global-setup] Obtaining session via signInWithPassword (publishable key)…");
  const { data: signInData, error: signInError } = await userClient.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error("[Playwright global-setup] signInWithPassword failed:", signInError.message);
    throw signInError;
  }

  const session = signInData.session;
  if (!session) {
    throw new Error("signInWithPassword returned no session");
  }

  const { data: userDetails } = await admin.auth.admin.getUserById(userId);
  const user = userDetails?.user ?? session.user;
  if (!user) {
    throw new Error(`Could not resolve user for ${userId}`);
  }

  const expiresAt = session.expires_at ?? Math.floor(Date.now() / 1000) + (session.expires_in ?? 3600);
  const sessionPayload = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: expiresAt,
    expires_in: session.expires_in ?? 3600,
    token_type: session.token_type ?? "bearer",
    user: {
      id: user.id,
      aud: user.aud ?? "authenticated",
      email: user.email,
      email_confirmed_at: user.email_confirmed_at ?? new Date().toISOString(),
      phone: user.phone ?? "",
      confirmed_at: user.confirmed_at ?? new Date().toISOString(),
      last_sign_in_at: user.last_sign_in_at ?? new Date().toISOString(),
      app_metadata: user.app_metadata ?? {},
      user_metadata: user.user_metadata ?? {},
      identities: user.identities ?? [],
      created_at: user.created_at ?? new Date().toISOString(),
      updated_at: user.updated_at ?? new Date().toISOString(),
    },
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const projectRef =
    supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] ||
    supabaseUrl.replace(/[^a-zA-Z0-9]/g, "_");
  const storageKey = `sb-${projectRef}-auth-token`;

  const sessionPayloadString = JSON.stringify(sessionPayload);
  await page.goto(baseURL, { waitUntil: "domcontentloaded", timeout: 30000 });

  await page.evaluate(
    ([key, valueStr]) => {
      localStorage.setItem(key, valueStr);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: valueStr,
          storageArea: localStorage,
        })
      );
    },
    [storageKey, sessionPayloadString]
  );

  const url = new URL(baseURL);
  const domain = url.hostname || "localhost";
  const cookieDomain = domain === "localhost" ? "localhost" : `.${domain}`;

  await context.addCookies([
    {
      name: `sb-${projectRef}-auth-token`,
      value: sessionPayloadString,
      domain: cookieDomain,
      path: "/",
      httpOnly: false,
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

  console.log("[Playwright global-setup] Verifying auth against /myprofile…");
  await page.goto(`${baseURL}/myprofile`, { waitUntil: "networkidle", timeout: 30000 });

  try {
    await page.waitForSelector('text=/profile|email|subscriptions|bookmarks/i', { timeout: 15000 });
    console.log("[Playwright global-setup] Authentication verified (profile content visible).");
  } catch {
    const currentUrl = page.url();
    if (currentUrl.includes("/signin")) {
      const body = await page.textContent("body");
      console.error("[Playwright global-setup] Still on sign-in after session injection:", body?.slice(0, 400));
      throw new Error("Authentication failed — redirected to sign-in");
    }
    console.warn("[Playwright global-setup] Profile selector not found; session may still be valid.");
  }

  const fs = await import("fs");
  const path = await import("path");
  const statePath = "playwright/.auth/state.json";
  const stateDir = path.dirname(statePath);
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }

  // Playwright persists cookies + per-origin localStorage as JSON. This file is not
  // Chromium-specific; Firefox/WebKit projects load the same shape via `storageState`.
  await context.storageState({ path: statePath });

  const savedState = JSON.parse(fs.readFileSync(statePath, "utf-8"));
  const hasLocalStorage = savedState.origins?.some((origin: { localStorage?: { name: string }[] }) =>
    origin.localStorage?.some(
      (item: { name: string }) => item.name.includes("auth-token") || item.name.includes("sb-")
    )
  );

  console.log("[Playwright global-setup] Storage state saved:", statePath);
  console.log(`   Cookies: ${savedState.cookies?.length ?? 0}`);
  console.log(`   Auth token in localStorage: ${hasLocalStorage ? "yes" : "no"}`);

  await browser.close();
  console.log("[Playwright global-setup] Complete.");
}

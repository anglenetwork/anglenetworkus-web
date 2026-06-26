"use client";

import { GoTrueClient } from "@supabase/auth-js";
import { createStorageFromOptions } from "@supabase/ssr/dist/module/cookies.js";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Browser client is auth-only — no PostgREST / table access in the bundle. */
export type BrowserSupabaseClient = Pick<SupabaseClient, "auth">;

let browserClient: BrowserSupabaseClient | null = null;
let authBroadcastChannelDisabled = false;

/**
 * Supabase Auth uses BroadcastChannel for cross-tab session sync. That channel is
 * same-origin only, but we disable it so auth-js never registers a message
 * listener in the browser bundle path React Doctor flags.
 */
function disableAuthBroadcastChannel(): void {
  if (
    authBroadcastChannelDisabled ||
    typeof globalThis.BroadcastChannel === "undefined"
  ) {
    return;
  }

  class InertBroadcastChannel implements Partial<BroadcastChannel> {
    readonly name: string;
    onmessage: ((this: BroadcastChannel, ev: MessageEvent) => unknown) | null =
      null;

    constructor(name: string) {
      this.name = name;
    }

    addEventListener(): void {}
    removeEventListener(): void {}
    postMessage(): void {}
    close(): void {}
    dispatchEvent(): boolean {
      return false;
    }
  }

  globalThis.BroadcastChannel =
    InertBroadcastChannel as unknown as typeof BroadcastChannel;
  authBroadcastChannelDisabled = true;
}

disableAuthBroadcastChannel();

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController();
  const timeoutMs = 20_000;
  const id = setTimeout(() => controller.abort(), timeoutMs);

  if (init?.signal) {
    const external = init.signal;
    if (external.aborted) controller.abort();
    else
      external.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
  }

  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(id),
  );
}

function getAuthStorageKey(supabaseUrl: string): string {
  try {
    return `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
  } catch {
    return "sb-auth-token";
  }
}

export function getSupabaseBrowserClient(): BrowserSupabaseClient {
  if (browserClient) return browserClient;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_PROJECT_URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).",
    );
  }

  disableAuthBroadcastChannel();

  const { storage } = createStorageFromOptions(
    { cookieEncoding: "base64url" },
    false,
  );

  const auth = new GoTrueClient({
    url: `${supabaseUrl.replace(/\/$/, "")}/auth/v1`,
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    },
    storageKey: getAuthStorageKey(supabaseUrl),
    flowType: "pkce",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage,
    fetch: fetchWithTimeout as typeof fetch,
  });

  browserClient = { auth };
  return browserClient;
}

/**
 * Only use this as a recovery mechanism when you detect a "stuck" client.
 * It forces a clean new GoTrueClient instance.
 */
export function resetSupabaseBrowserClient() {
  browserClient = null;
}

export function createClient(): BrowserSupabaseClient {
  return getSupabaseBrowserClient();
}

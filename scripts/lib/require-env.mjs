const SANITY_WRITE_ENV_KEYS = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_WRITE_TOKEN",
];

export function requireSanityWriteEnv() {
  const missing = SANITY_WRITE_ENV_KEYS.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

export function requireSanityReadEnv() {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    missing.push("NEXT_PUBLIC_SANITY_DATASET");
  }
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

function requireSupabaseServiceEnv() {
  const missing = [];
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  if (!supabaseUrl) {
    missing.push(
      "NEXT_PUBLIC_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_PROJECT_URL)",
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
  return { supabaseUrl };
}

import type { SupabaseClient, User } from "@supabase/supabase-js";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Find a user by email via paginated admin list (no public signup).
 */
export async function findUserByEmail(
  admin: SupabaseClient,
  email: string
): Promise<User | null> {
  const target = normalizeEmail(email);
  const perPage = 200;
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const u = data.users.find((x) => normalizeEmail(x.email ?? "") === target);
    if (u) return u;
    if (data.users.length < perPage) return null;
  }
  return null;
}

export type EnsureTestUserResult = {
  userId: string;
  action: "created" | "updated";
};

/**
 * Create or update the Playwright test user using the service-role admin API only.
 */
export async function ensurePlaywrightTestUser(
  admin: SupabaseClient,
  email: string,
  password: string
): Promise<EnsureTestUserResult> {
  const existing = await findUserByEmail(admin, email);
  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    return { userId: existing.id, action: "updated" };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    const msg = String(error.message || "").toLowerCase();
    const maybeExists =
      msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("registered") ||
      msg.includes("duplicate");
    if (maybeExists) {
      const again = await findUserByEmail(admin, email);
      if (again) {
        const { error: uerr } = await admin.auth.admin.updateUserById(again.id, {
          password,
          email_confirm: true,
        });
        if (uerr) throw uerr;
        return { userId: again.id, action: "updated" };
      }
    }
    throw error;
  }

  const id = data.user?.id;
  if (!id) throw new Error("createUser returned no user id");
  return { userId: id, action: "created" };
}

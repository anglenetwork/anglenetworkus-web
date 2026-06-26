export type ProfileSummary = {
  firstName: string | null;
  lastName: string | null;
};

export async function fetchProfileSummary(): Promise<ProfileSummary | null> {
  const res = await fetch("/api/profile/summary", { cache: "no-store" });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error || "Failed to load profile summary");
  }

  return (await res.json()) as ProfileSummary;
}

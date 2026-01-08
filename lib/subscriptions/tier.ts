export type Tier = "free" | "pro" | "lifetime";

export const tierPriority: Record<Tier, number> = {
  free: 0,
  pro: 1,
  lifetime: 2,
};

export function hasAtLeastTier(current: Tier, required: Tier) {
  return tierPriority[current] >= tierPriority[required];
}

export function getTierFromEntitlements(rows: Array<{ key: string; valid_until: string | null; active: boolean }>): {
  tier: Tier;
  validUntil: string | null;
} {
  const now = Date.now();

  const isActiveAndValid = (r: { active: boolean; valid_until: string | null }) => {
    if (!r.active) return false;
    if (!r.valid_until) return true; // free has null; lifetime/pro should have date, but allow null just in case
    return new Date(r.valid_until).getTime() > now;
  };

  const tierRows = rows.filter((r) => r.key.startsWith("tier:") && isActiveAndValid(r));

  const hasLifetime = tierRows.some((r) => r.key === "tier:lifetime");
  if (hasLifetime) {
    const life = tierRows.find((r) => r.key === "tier:lifetime")!;
    return { tier: "lifetime", validUntil: life.valid_until };
  }

  const hasPro = tierRows.some((r) => r.key === "tier:pro");
  if (hasPro) {
    const pro = tierRows.find((r) => r.key === "tier:pro")!;
    return { tier: "pro", validUntil: pro.valid_until };
  }

  return { tier: "free", validUntil: null };
}





export type Tier = "free" | "pro" | "lifetime";

export const tierPriority: Record<Tier, number> = {
  free: 0,
  pro: 1,
  lifetime: 2,
};

export function hasAtLeastTier(current: Tier, required: Tier) {
  return tierPriority[current] >= tierPriority[required];
}

export type Tier = "free" | "pro" | "lifetime";

const tierPriority: Record<Tier, number> = {
  free: 0,
  pro: 1,
  lifetime: 2,
};

function hasAtLeastTier(current: Tier, required: Tier) {
  return tierPriority[current] >= tierPriority[required];
}

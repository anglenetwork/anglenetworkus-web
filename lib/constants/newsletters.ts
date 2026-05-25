export const AVAILABLE_NEWSLETTERS = [
  { key: "daily_brief", label: "Daily Brief" },
  { key: "breaking_news", label: "Breaking News" },
  { key: "tech_weekly", label: "Tech Weekly" },
] as const;

export type NewsletterKey = (typeof AVAILABLE_NEWSLETTERS)[number]["key"];

import "server-only";

/**
 * Dev-only: log when ranking surfaces fall back because metrics are missing or empty.
 * Never logs in production; never sent to the client.
 */
export function logDevMetricsFallback(
  surface: string,
  reason: "infra_error" | "empty_or_no_activity"
): void {
  if (process.env.NODE_ENV !== "development") return;
  const label = reason === "infra_error" ? "metrics_unavailable" : "no_usable_metrics_rows";
  console.info(`[metrics-fallback] ${surface} ${label}`);
}

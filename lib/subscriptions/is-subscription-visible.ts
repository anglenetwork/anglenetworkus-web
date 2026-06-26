/** Whether subscription UI and routes are enabled (set IS_SUBSCRIPTION_VISIBLE=true). */
export function isSubscriptionVisible(): boolean {
  return process.env.IS_SUBSCRIPTION_VISIBLE === "true";
}

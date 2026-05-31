import type { Tier } from "@/lib/subscriptions/tier";

export type SubscriptionUiState = {
  loading: boolean;
  tier: Tier;
  originalTier: Tier;
  validUntil: string | null;
  status: string | null;
  billingYearly: boolean;
  error: string | null;
  checkoutLoading: string | null;
  cancelLoading: boolean;
};

export type SubscriptionUiAction =
  | { type: "load_start" }
  | {
      type: "load_success";
      tier: Tier;
      originalTier: Tier;
      validUntil: string | null;
      status: string | null;
    }
  | { type: "load_error"; error: string }
  | { type: "set_billing_yearly"; billingYearly: boolean }
  | { type: "set_error"; error: string | null }
  | { type: "checkout_start"; tier: string }
  | { type: "checkout_end" }
  | { type: "cancel_start" }
  | { type: "cancel_end" };

export function createInitialSubscriptionState(
  checkoutCanceled: boolean,
): SubscriptionUiState {
  return {
    loading: true,
    tier: "free",
    originalTier: "free",
    validUntil: null,
    status: null,
    billingYearly: false,
    error: checkoutCanceled
      ? "Checkout was canceled. Please try again if you'd like to upgrade."
      : null,
    checkoutLoading: null,
    cancelLoading: false,
  };
}

export function subscriptionUiReducer(
  state: SubscriptionUiState,
  action: SubscriptionUiAction,
): SubscriptionUiState {
  switch (action.type) {
    case "load_start":
      return { ...state, loading: true, error: null };
    case "load_success":
      return {
        ...state,
        loading: false,
        tier: action.tier,
        originalTier: action.originalTier,
        validUntil: action.validUntil,
        status: action.status,
      };
    case "load_error":
      return { ...state, loading: false, error: action.error };
    case "set_billing_yearly":
      return { ...state, billingYearly: action.billingYearly };
    case "set_error":
      return { ...state, error: action.error };
    case "checkout_start":
      return {
        ...state,
        checkoutLoading: action.tier,
        error: null,
      };
    case "checkout_end":
      return { ...state, checkoutLoading: null };
    case "cancel_start":
      return { ...state, cancelLoading: true, error: null };
    case "cancel_end":
      return { ...state, cancelLoading: false };
    default:
      return state;
  }
}

export function getEffectiveTier(
  tier: Tier,
  validUntil: string | null,
): Tier {
  if (tier === "pro" && validUntil) {
    const until = new Date(validUntil);
    if (until < new Date()) {
      return "free";
    }
  }
  return tier;
}

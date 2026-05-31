import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

const getStripe = (): Stripe => {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
};

// Export a default instance for convenience
export const stripe = getStripe();

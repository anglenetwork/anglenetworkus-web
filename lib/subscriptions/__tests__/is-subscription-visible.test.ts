import { afterEach, describe, expect, it } from "vitest";
import { isSubscriptionVisible } from "../is-subscription-visible";

describe("isSubscriptionVisible", () => {
  const original = process.env.IS_SUBSCRIPTION_VISIBLE;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.IS_SUBSCRIPTION_VISIBLE;
    } else {
      process.env.IS_SUBSCRIPTION_VISIBLE = original;
    }
  });

  it("returns true when IS_SUBSCRIPTION_VISIBLE is true", () => {
    process.env.IS_SUBSCRIPTION_VISIBLE = "true";
    expect(isSubscriptionVisible()).toBe(true);
  });

  it("returns false when IS_SUBSCRIPTION_VISIBLE is false or unset", () => {
    process.env.IS_SUBSCRIPTION_VISIBLE = "false";
    expect(isSubscriptionVisible()).toBe(false);

    delete process.env.IS_SUBSCRIPTION_VISIBLE;
    expect(isSubscriptionVisible()).toBe(false);
  });
});

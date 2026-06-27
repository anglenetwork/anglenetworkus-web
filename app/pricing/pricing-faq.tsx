import { Switch } from "@/components/ui/switch";
import { PRICING_FAQ_ITEMS } from "./pricing-faq-items";

export function PricingBillingToggle({
  billingYearly,
  onBillingYearlyChange,
}: {
  billingYearly: boolean;
  onBillingYearlyChange: (checked: boolean) => void;
}) {
  return (
    <div className="mb-12 flex justify-center">
      <div className="flex items-center justify-center gap-4 rounded-full border border-gray-300 bg-transparent px-4 py-2">
        <span
          className={`font-semibold text-lg ${!billingYearly ? "text-gray-900" : "text-gray-500"}`}
        >
          Billed monthly
        </span>
        <Switch
          checked={billingYearly}
          onCheckedChange={onBillingYearlyChange}
        />
        <span
          className={`font-semibold text-lg ${billingYearly ? "text-gray-900" : "text-gray-500"}`}
        >
          Billed yearly
        </span>
      </div>
    </div>
  );
}

export function PricingFaq() {
  return (
    <div className="mx-auto mt-16 max-w-4xl px-4">
      <div className="text-center">
        <h2 className="mb-6 font-bold text-2xl text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="grid gap-6 text-left md:grid-cols-2">
          {PRICING_FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 font-semibold text-gray-900">
                {item.question}
              </h3>
              <p className="text-gray-600 text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";

const FAQ_ITEMS = [
  {
    q: "Can I change plans anytime?",
    a: "Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data remains safe. You can access and export it for 30 days after cancellation.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes! Annual plans include a 10% discount. You can switch between monthly and yearly billing at any time.",
  },
] as const;

export function SubscriptionsFaq() {
  return (
    <div className="max-w-3xl">
      <h2 className="mb-8 font-bold text-2xl">Common Questions</h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((faq) => (
          <Card
            key={faq.q}
            className="border border-border/60 p-6 transition-colors hover:border-primary/40"
          >
            <h3 className="mb-2 font-semibold">{faq.q}</h3>
            <p className="text-muted-foreground text-sm">{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

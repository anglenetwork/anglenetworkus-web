import { Card } from "@/components/ui/card";
import {
  profileSubscriptionFaqAnswer,
  profileSubscriptionFaqQuestion,
  profileSubscriptionFaqTitle,
} from "@/app/lib/typography/myprofile-page";

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
      <h2 className={profileSubscriptionFaqTitle}>Common Questions</h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((faq) => (
          <Card
            key={faq.q}
            className="border border-border/60 p-6 transition-colors hover:border-primary/40"
          >
            <h3 className={profileSubscriptionFaqQuestion}>{faq.q}</h3>
            <p className={profileSubscriptionFaqAnswer}>{faq.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const subscriptions = [
  {
    id: 1,
    name: "Pro Plan",
    price: "$29/month",
    status: "active",
    features: ["Advanced analytics", "Priority support", "Custom domain"],
  },
  {
    id: 2,
    name: "Storage Add-on",
    price: "$5/month",
    status: "active",
    features: ["Extra 100GB storage"],
  },
];

export default async function SubscriptionPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2 font-sans">
          Subscriptions
        </h1>
        <p className="text-slate-600 font-sans">
          Manage your active subscriptions and billing
        </p>
      </div>

      <div className="space-y-8">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="pb-8 border-b border-slate-200 last:border-b-0"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 font-sans">
                  {subscription.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1 font-sans">
                  {subscription.price}
                </p>
              </div>
              <Badge
                variant="default"
                className="bg-green-100 text-green-700 hover:bg-green-100 font-sans"
              >
                {subscription.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-2 mb-6">
              {subscription.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-slate-700 font-sans"
                >
                  <Check className="h-4 w-4 text-slate-900" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button className=" text-black  font-sans" variant="outline">
                Manage
              </Button>
              <Button className=" font-sans" variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button className="bg-slate-900 text-white hover:bg-slate-800 font-sans">
          View Billing History
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { AVAILABLE_NEWSLETTERS } from "@/lib/constants/newsletters";

interface NewsletterPreference {
  newsletter_key: string;
  enabled: boolean;
}

interface NewsletterTogglesProps {
  userId: string;
}

export function NewsletterToggles({ userId }: NewsletterTogglesProps) {
  const [preferences, setPreferences] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_preferences")
        .select("newsletter_key, enabled")
        .eq("user_id", userId);

      if (error) throw error;

      // Initialize preferences object with defaults
      const prefs: Record<string, boolean> = {};
      AVAILABLE_NEWSLETTERS.forEach((newsletter) => {
        prefs[newsletter.key] = false;
      });

      // Update with fetched preferences
      if (data) {
        data.forEach((pref: NewsletterPreference) => {
          prefs[pref.newsletter_key] = pref.enabled;
        });
      }

      setPreferences(prefs);
    } catch (error) {
      console.error("Error fetching newsletter preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (newsletterKey: string, enabled: boolean) => {
    setUpdating((prev) => ({ ...prev, [newsletterKey]: true }));

    try {
      // Upsert the preference
      const { error } = await supabase
        .from("newsletter_preferences")
        .upsert(
          {
            user_id: userId,
            newsletter_key: newsletterKey,
            enabled,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,newsletter_key",
          }
        );

      if (error) throw error;

      // Optimistic update
      setPreferences((prev) => ({
        ...prev,
        [newsletterKey]: enabled,
      }));
    } catch (error) {
      console.error("Error updating newsletter preference:", error);
      // Revert on error
      setPreferences((prev) => ({
        ...prev,
        [newsletterKey]: !enabled,
      }));
    } finally {
      setUpdating((prev) => ({ ...prev, [newsletterKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {AVAILABLE_NEWSLETTERS.map((newsletter) => (
          <Skeleton key={newsletter.key} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {AVAILABLE_NEWSLETTERS.map((newsletter, index) => (
        <div key={newsletter.key}>
          <div className="flex items-center justify-between">
            <Label
              htmlFor={newsletter.key}
              className="font-sans text-base font-normal cursor-pointer"
            >
              {newsletter.label}
            </Label>
            <Switch
              id={newsletter.key}
              checked={preferences[newsletter.key] || false}
              onCheckedChange={(checked) =>
                handleToggle(newsletter.key, checked)
              }
              disabled={updating[newsletter.key]}
            />
          </div>
          {index < AVAILABLE_NEWSLETTERS.length - 1 && (
            <Separator className="mt-4" />
          )}
        </div>
      ))}
    </div>
  );
}


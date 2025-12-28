"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const fetchPreferences = useCallback(async () => {
    if (!userId) return;
    const supabase = createClient();
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
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchPreferences();
    }
  }, [userId, fetchPreferences]);

  const handleToggle = async (newsletterKey: string, enabled: boolean) => {
    setUpdating((prev) => ({ ...prev, [newsletterKey]: true }));

    // Optimistic update
    setPreferences((prev) => ({
      ...prev,
      [newsletterKey]: enabled,
    }));

    try {
      const supabase = createClient();

      // Check if preference exists
      const { data: existing, error: checkError } = await supabase
        .from("newsletter_preferences")
        .select("id")
        .eq("user_id", userId)
        .eq("newsletter_key", newsletterKey)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Update existing preference
        const { error: updateError } = await supabase
          .from("newsletter_preferences")
          .update({
            enabled,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) throw updateError;
      } else {
        // Insert new preference
        const { error: insertError } = await supabase
          .from("newsletter_preferences")
          .insert({
            user_id: userId,
            newsletter_key: newsletterKey,
            enabled,
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }
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

  const getNewsletterDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      daily_brief: "Latest news and updates delivered daily",
      breaking_news: "Be the first to know about breaking news",
      tech_weekly: "Weekly tech news and updates",
    };
    return descriptions[key] || "Newsletter updates";
  };

  return (
    <div className="space-y-4">
      {AVAILABLE_NEWSLETTERS.map((newsletter) => (
        <div
          key={newsletter.key}
          className="flex items-center justify-between py-4 px-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
        >
          <div className="flex items-start gap-4 flex-1">
            <Mail className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-900 font-sans">
                {newsletter.label}
              </h3>
              <p className="text-sm text-slate-600 mt-0.5 font-sans">
                {getNewsletterDescription(newsletter.key)}
              </p>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <Switch
              checked={preferences[newsletter.key] || false}
              onCheckedChange={(checked) =>
                handleToggle(newsletter.key, checked)
              }
              disabled={updating[newsletter.key]}
              aria-label={`Subscribe to ${newsletter.label}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

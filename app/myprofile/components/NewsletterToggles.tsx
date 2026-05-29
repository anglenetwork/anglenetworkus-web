"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { AVAILABLE_NEWSLETTERS } from "@/lib/constants/newsletters";

interface NewsletterPreferenceRow {
  newsletter_key: string;
  enabled: boolean;
}

export function NewsletterToggles() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const defaults = useMemo(() => {
    const prefs: Record<string, boolean> = {};
    for (const n of AVAILABLE_NEWSLETTERS) prefs[n.key] = false;
    return prefs;
  }, []);

  const fetchPreferences = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/newsletters/list", {
        method: "GET",
        cache: "no-store",
      });

      if (res.status === 401) {
        setPreferences(defaults);
        return;
      }

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        console.error("Error fetching newsletter preferences:", json?.error);
        setPreferences(defaults);
        return;
      }

      const prefs = { ...defaults };
      const rows: NewsletterPreferenceRow[] = json?.preferences || [];

      for (const row of rows) {
        prefs[row.newsletter_key] = !!row.enabled;
      }

      setPreferences(prefs);
    } catch (err) {
      console.error("Error fetching newsletter preferences:", err);
      setPreferences(defaults);
    } finally {
      setLoading(false);
    }
  }, [defaults]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleToggle = async (newsletterKey: string, enabled: boolean) => {
    // If a previous request got stuck, this guarantees we can click again later.
    setUpdating((prev) => ({ ...prev, [newsletterKey]: true }));

    // optimistic update
    setPreferences((prev) => ({ ...prev, [newsletterKey]: enabled }));

    // optional safety timeout so "in flight" never lasts forever
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch("/api/newsletters/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({ newsletterKey, enabled }),
      });

      const json = (await res.json().catch(() => ({}))) as any;

      if (res.status === 401) {
        // revert if unauth
        setPreferences((prev) => ({ ...prev, [newsletterKey]: !enabled }));
        return;
      }

      if (!res.ok) {
        console.error(
          "Error updating preference:",
          json?.error || res.statusText,
        );
        setPreferences((prev) => ({ ...prev, [newsletterKey]: !enabled }));
        return;
      }
    } catch (err) {
      console.error("Error updating newsletter preference:", err);
      setPreferences((prev) => ({ ...prev, [newsletterKey]: !enabled }));
    } finally {
      clearTimeout(t);
      setUpdating((prev) => ({ ...prev, [newsletterKey]: false }));
    }
  };

  const getNewsletterDescription = (key: string) => {
    const descriptions: Record<string, string> = {
      daily_brief: "Latest news and updates delivered daily",
      breaking_news: "Be the first to know about breaking news",
      tech_weekly: "Weekly tech news and updates",
    };
    return descriptions[key] || "Newsletter updates";
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
      {AVAILABLE_NEWSLETTERS.map((newsletter) => (
        <div
          key={newsletter.key}
          className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300"
        >
          <div className="flex flex-1 items-start gap-4">
            <Mail className="mt-0.5 size-5 flex-shrink-0 text-slate-600" />
            <div>
              <h3 className="font-sans font-semibold text-slate-900">
                {newsletter.label}
              </h3>
              <p className="mt-0.5 font-sans text-slate-600 text-sm">
                {getNewsletterDescription(newsletter.key)}
              </p>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <Switch
              checked={!!preferences[newsletter.key]}
              onCheckedChange={(checked) =>
                handleToggle(newsletter.key, checked)
              }
              disabled={!!updating[newsletter.key]}
              aria-label={`Subscribe to ${newsletter.label}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

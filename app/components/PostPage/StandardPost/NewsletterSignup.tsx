"use client";

import {
  postNewsletterBody,
  postNewsletterEyebrow,
  postNewsletterHeading,
} from "@/app/lib/typography/post-standard";

/**
 * Presentational newsletter signup card for the post-page sidebar.
 * No submit handler / API wiring exists yet — this is UI only.
 */
export default function NewsletterSignup() {
  return (
    <div className="bg-news-text p-[26px_22px]">
      <p className={postNewsletterEyebrow}>The Morning Briefing</p>
      <h3 className={postNewsletterHeading}>
        The day&apos;s essential stories, before 7am.
      </h3>
      <p className={`mt-2.5 mb-[18px] ${postNewsletterBody}`}>
        One email. No noise. Cancel anytime.
      </p>
      <form className="flex gap-2" onSubmit={(event) => event.preventDefault()}>
        <input
          type="email"
          required
          placeholder="Your email"
          aria-label="Email address"
          className="min-w-0 flex-1 border border-news-muted bg-news-text px-3 py-2.5 font-sans text-[13.5px] text-white placeholder:text-news-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
        />
        <button
          type="submit"
          className="shrink-0 bg-white px-4 py-2.5 font-display font-semibold text-[13.5px] text-news-text transition-opacity hover:opacity-90"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Client component that adds resource hints (dns-prefetch only) for external domains
 * to improve image loading performance without adding unused preconnects.
 * Uses dns-prefetch instead of preconnect to avoid warnings about unused preconnects.
 */
export function ResourceHints() {
  useEffect(() => {
    // Use dns-prefetch instead of preconnect to avoid unused preconnect warnings
    // dns-prefetch is lighter and only resolves DNS, not full connection
    const domains = [
      "https://upload.wikimedia.org",
      "https://images.pexels.com",
    ];

    domains.forEach((domain) => {
      // Check if link already exists
      const existingDns = document.querySelector(
        `link[rel="dns-prefetch"][href="${domain}"]`,
      );
      if (!existingDns) {
        const dnsLink = document.createElement("link");
        dnsLink.rel = "dns-prefetch";
        dnsLink.href = domain;
        document.head.appendChild(dnsLink);
      }
    });
  }, []);

  return null;
}

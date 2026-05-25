/**
 * Privacy Policy Configuration
 *
 * This file contains all the variables and placeholders used in the privacy policy.
 * Update these values to customize the privacy policy content.
 *
 * HOW TO MODIFY THE PRIVACY POLICY:
 *
 * 1. Update variables in this file (privacy-policy-config.ts):
 *    - Company information (name, address, email, phone)
 *    - Feature flags (enable/disable sections based on your features)
 *    - Links and URLs
 *    - Data retention periods
 *    - Children's privacy age
 *
 * 2. Modify content in lib/privacy-policy-content.tsx:
 *    - Edit the PrivacyPolicyContent component to change text, structure, or sections
 *    - All placeholders are replaced with values from this config file
 *    - Sections are conditionally rendered based on feature flags
 *
 * 3. The privacy policy page automatically uses these values:
 *    - app/company/privacy-policy/page.tsx imports and renders PrivacyPolicyContent
 *
 * EXAMPLE: To update company name, change:
 *   company.legalName: "Your Company Name"
 *   company.websiteName: "Your Website Name"
 *
 * EXAMPLE: To enable EU/UK addendum, set:
 *   features.euUkUsers: true
 *
 * EXAMPLE: To add your address, fill in:
 *   company.address.street: "123 Main St"
 *   company.address.city: "New York"
 *   company.address.state: "NY"
 *   company.address.zip: "10001"
 */

export const privacyPolicyConfig = {
  // Company Information
  company: {
    legalName: "The Angle LLC",
    websiteName: "The Angle",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
    email: {
      privacy: "privacy@theangle.com",
      general: "contact@theangle.com",
    },
    phone: "", // Optional
  },

  // Data Protection Officer (if applicable)
  dpo: {
    enabled: false,
    name: "",
    title: "",
    email: "",
    contactForm: "",
  },

  // Children's Privacy
  children: {
    minimumAge: 13, // 13, 16, or 18
    standard: "13", // For display in text
  },

  // Data Retention Periods
  retention: {
    accountData:
      "for the life of the account + a limited period for security/audit",
    newsletterSubscriptions:
      "until you unsubscribe (plus a short suppression list to honor opt-outs)",
    analyticsLogs: "12–26 months, then aggregated or deleted",
    securityLogs: "30–180 days, longer if needed for investigations",
  },

  // Primary Country
  primaryCountry: "United States",

  // Links and URLs
  links: {
    cookiePreferences: "/cookie-preferences",
    accountPreferences: "/myprofile/profile-details",
    accountDeletion: "/myprofile/profile-details",
    privacyRequestPortal: "/privacy-request",
    doNotSellLink: "/do-not-sell",
    ethicsPolicy: "/company/editorial-standards", // Optional
    appealsEmail: "privacy@theangle.com",
  },

  // Features Enabled
  features: {
    subscriptions: true,
    donations: false,
    comments: false,
    userGeneratedContent: false,
    socialSignIn: true,
    targetedAdvertising: true,
    personalizedContent: true,
    euUkUsers: false, // Set to true if you have EU/UK users
  },

  // Last Updated Date
  lastUpdated: "January 1, 2025",
};

/**
 * Helper function to format the company address
 */
export function getCompanyAddress(): string {
  const { address } = privacyPolicyConfig.company;
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);
  return parts.join(", ") || privacyPolicyConfig.company.address.country;
}

/**
 * Helper function to get contact information
 */
export function getContactInfo() {
  return {
    email: privacyPolicyConfig.company.email.privacy,
    address: getCompanyAddress(),
    phone: privacyPolicyConfig.company.phone,
    portal: privacyPolicyConfig.links.privacyRequestPortal,
  };
}

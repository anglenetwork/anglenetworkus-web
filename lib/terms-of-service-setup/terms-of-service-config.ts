/**
 * Terms of Service Configuration
 * 
 * This file contains all the variables and placeholders used in the terms of service.
 * Update these values to customize the terms of service content.
 * 
 * HOW TO MODIFY THE TERMS OF SERVICE:
 * 
 * 1. Update variables in this file (terms-of-service-config.ts):
 *    - Company information (name, address, email, phone)
 *    - Legal information (governing law, jurisdiction, arbitration provider)
 *    - Contact information for legal notices
 *    - Links and URLs
 * 
 * 2. Modify content in terms-of-service-content.tsx:
 *    - Edit the TermsOfServiceContent component to change text, structure, or sections
 *    - All placeholders are replaced with values from this config file
 * 
 * 3. The terms of service page automatically uses these values:
 *    - app/company/terms-of-service/page.tsx imports and renders TermsOfServiceContent
 */

export const termsOfServiceConfig = {
  // Company Information
  company: {
    legalName: "The Angle LLC",
    brandName: "The Angle",
    websiteDomain: "theangle.com",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
    },
    email: {
      legal: "legal@theangle.com",
      contact: "contact@theangle.com",
      permissions: "permissions@theangle.com",
      dmca: "dmca@theangle.com",
    },
    phone: "", // Optional
  },

  // Legal Information
  legal: {
    country: "United States",
    state: "New York",
    county: "New York County",
    governingLaw: "State of New York",
    jurisdiction: "New York County, New York",
    arbitrationProvider: "AAA", // AAA, JAMS, or NAM
  },

  // DMCA Information
  dmca: {
    agentName: "",
    agentTitle: "",
    email: "dmca@theangle.com",
    phone: "", // Optional
  },

  // Links and URLs
  links: {
    termsOfServiceUrl: "/company/terms-of-service",
  },

  // Last Updated Date
  lastUpdated: "January 1, 2025",
  effectiveDate: "January 1, 2025",
};

/**
 * Helper function to format the company address
 */
export function getCompanyAddress(): string {
  const { address } = termsOfServiceConfig.company;
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);
  return parts.join(", ") || termsOfServiceConfig.company.address.country;
}

/**
 * Helper function to get contact information
 */
export function getContactInfo() {
  return {
    legalEmail: termsOfServiceConfig.company.email.legal,
    contactEmail: termsOfServiceConfig.company.email.contact,
    permissionsEmail: termsOfServiceConfig.company.email.permissions,
    dmcaEmail: termsOfServiceConfig.company.email.dmca,
    address: getCompanyAddress(),
    phone: termsOfServiceConfig.company.phone,
  };
}

export type PublisherJsonLd = {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: { "@type": "ImageObject"; url: string };
};

export type NewsMediaOrganizationJsonLd = {
  "@type": "NewsMediaOrganization";
  "@id"?: string;
  name: string;
  url: string;
  logo?: { "@type": "ImageObject"; url: string };
};

export function buildPublisherJsonLd(args: {
  siteName: string;
  siteUrl: string;
  logoUrl?: string | null;
}): PublisherJsonLd {
  const publisher: PublisherJsonLd = {
    "@type": "Organization",
    name: args.siteName,
    url: args.siteUrl,
  };
  if (args.logoUrl) {
    publisher.logo = {
      "@type": "ImageObject",
      url: args.logoUrl,
    };
  }
  return publisher;
}

export function buildNewsMediaOrganizationJsonLd(args: {
  siteName: string;
  siteUrl: string;
  logoUrl?: string | null;
  id?: string;
}): NewsMediaOrganizationJsonLd {
  const org: NewsMediaOrganizationJsonLd = {
    "@type": "NewsMediaOrganization",
    name: args.siteName,
    url: args.siteUrl,
  };
  if (args.id) {
    org["@id"] = args.id;
  }
  if (args.logoUrl) {
    org.logo = {
      "@type": "ImageObject",
      url: args.logoUrl,
    };
  }
  return org;
}

export function organizationJsonLdId(siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}/#organization`;
}

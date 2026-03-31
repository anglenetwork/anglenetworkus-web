export type PublisherJsonLd = {
  "@type": "Organization";
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

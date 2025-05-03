// app/utils/structuredData.ts

export interface AppData {
  appName: string;
  appDescription: string;
  appUrl: string;
  version: string;
  features: string[];
  screenshots: { url: string; caption: string }[];
  rating?: { value: number; count: number };
}

interface JsonLd {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string[];
  operatingSystem: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  featureList: string[];
  screenshot: {
    "@type": string;
    url: string;
    caption: string;
  }[];
  softwareVersion: string;
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    ratingCount: string;
  };
}

export function generateStructuredData(data: AppData): JsonLd {
  const {
    appName,
    appDescription,
    appUrl,
    version,
    features,
    screenshots,
    rating,
  } = data;

  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    description: appDescription,
    url: appUrl,
    applicationCategory: ["MultimediaApplication", "PhotographyApplication"],
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: features,
    screenshot: screenshots.map(({ url, caption }) => ({
      "@type": "ImageObject",
      url,
      caption,
    })),
    softwareVersion: version,
  };

  if (rating && rating.value && rating.count) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value.toFixed(1),
      ratingCount: rating.count.toString(),
    };
  }

  return jsonLd;
}
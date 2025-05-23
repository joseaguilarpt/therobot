// Interface representing the application's data structure
export interface AppData {
  appName: string; // Name of the application
  appDescription: string; // Short description of the application
  appUrl: string; // URL where the application is hosted
  version: string; // Current version of the application
  features: string[]; // List of features provided by the application
  screenshots: { url: string; caption: string }[]; // Array of screenshots with captions
  rating?: { value: number; count: number }; // Optional rating information
}

// Interface representing the JSON-LD structure for structured data
interface JsonLd {
  "@context": string; // Schema.org context
  "@type": string; // Type of the item (WebApplication)
  name: string; // Application name
  description: string; // Application description
  url: string; // Application URL
  applicationCategory: string[]; // Categories the application belongs to
  operatingSystem: string; // Supported operating systems
  offers: {
    "@type": string; // Type of offer (Offer)
    price: string; // Price of the application
    priceCurrency: string; // Currency of the price
  };
  featureList: string[]; // List of features
  screenshot: {
    "@type": string; // Type of screenshot (ImageObject)
    url: string; // Screenshot URL
    caption: string; // Screenshot caption
  }[];
  softwareVersion: string; // Application version
  aggregateRating?: {
    "@type": string; // Type of rating (AggregateRating)
    ratingValue: string; // Average rating value
    ratingCount: string; // Number of ratings
  };
}

// Generates structured data (JSON-LD) for the application
export function generateStructuredData(data: AppData): JsonLd {
  // Destructure input data for easier access
  const {
    appName,
    appDescription,
    appUrl,
    version,
    features,
    screenshots,
    rating,
  } = data;

  // Build the base JSON-LD object
  const jsonLd: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    description: appDescription,
    url: appUrl,
    applicationCategory: ["MultimediaApplication", "PhotographyApplication"], // Example categories
    operatingSystem: "All", // Supports all operating systems
    offers: {
      "@type": "Offer",
      price: "0", // Free application
      priceCurrency: "USD",
    },
    featureList: features,
    // Map screenshots to the required JSON-LD format
    screenshot: screenshots.map(({ url, caption }) => ({
      "@type": "ImageObject",
      url,
      caption,
    })),
    softwareVersion: version,
  };

  // Add aggregate rating if available
  if (rating && rating.value && rating.count) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value.toFixed(1), // Format rating value to one decimal place
      ratingCount: rating.count.toString(),
    };
  }

  return jsonLd;
}
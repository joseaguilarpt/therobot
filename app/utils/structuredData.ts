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
  
  export function generateStructuredData(data: AppData) {
    const {
      appName,
      appDescription,
      appUrl,
      version,
      features,
      screenshots,
      rating,
    } = data;
  
    const jsonLd: Record<string, any> = {
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
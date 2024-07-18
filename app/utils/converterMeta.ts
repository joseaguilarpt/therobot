import { MetaFunction } from "@remix-run/react";
import { createMeta } from "./meta";

const formatBenefits: Record<string, string> = {
  jpeg: "smaller file sizes",
  png: "lossless quality and transparency",
  gif: "animations and simple graphics",
  webp: "superior compression for web",
  avif: "next-gen compression and quality",
  tiff: "high-quality for print and editing",
  svg: "scalable vector graphics",
  bmp: "uncompressed bitmap images",
  pdf: "document and image compatibility",
};

const formatSpecificKeywords: Record<string, string[]> = {
  jpeg: ["lossy compression", "photography", "web images"],
  png: ["lossless compression", "transparency", "graphics"],
  gif: ["animated images", "short animations", "memes"],
  webp: ["web optimization", "faster loading", "next-gen format"],
  avif: ["advanced compression", "high quality", "modern format"],
  tiff: ["high resolution", "professional printing", "image editing"],
  svg: ["vector graphics", "scalable images", "logos"],
  bmp: ["bitmap images", "uncompressed format", "legacy format"],
  pdf: ["document conversion", "image extraction", "multi-page"],
};

const baseKeywords = [
  "image conversion",
  "free converter",
  "online tool",
  "image format",
  "file conversion",
  "digital images",
];

function generateKeywords(sourceFormat: string, targetFormat: string): string {
  const sourceKeywords = formatSpecificKeywords[sourceFormat] || [];
  const targetKeywords = formatSpecificKeywords[targetFormat] || [];
  const conversionKeywords = [
    `${sourceFormat} to ${targetFormat}`,
    `convert ${sourceFormat} to ${targetFormat}`,
    `${sourceFormat} ${targetFormat} converter`,
    `change ${sourceFormat} to ${targetFormat}`,
    `${sourceFormat} into ${targetFormat}`,
  ];

  const allKeywords = [
    ...baseKeywords,
    ...sourceKeywords,
    ...targetKeywords,
    ...conversionKeywords,
  ];

  const uniqueKeywords = Array.from(new Set(allKeywords));
  return uniqueKeywords.join(", ");
}

export const meta: MetaFunction = ({ data }) => {
  const { sourceFormat, targetFormat } = data as { sourceFormat: string; targetFormat: string };

  const sourceFormatUpper = sourceFormat.toUpperCase();
  const targetFormatUpper = targetFormat.toUpperCase();
  const sourceBenefit = formatBenefits[sourceFormat] || "";
  const targetBenefit = formatBenefits[targetFormat] || "";

  const title = `Convert ${sourceFormatUpper} to ${targetFormatUpper} - Free Online Image Converter | Easy Convert Image`;
  const description = `Transform your ${sourceFormatUpper} images to ${targetFormatUpper} format effortlessly. Our free online converter maintains ${sourceBenefit} while providing ${targetBenefit}. No signup required, instant conversion!`;
  const url = `https://easyconvertimage.com/convert/${sourceFormat}/${targetFormat}`;

  return createMeta({
    title,
    description,
    keywords: generateKeywords(sourceFormat, targetFormat),
    ogTitle: `${sourceFormatUpper} to ${targetFormatUpper} Converter - Free & Instant | Easy Convert Image`,
    ogDescription: `Convert ${sourceFormatUpper} to ${targetFormatUpper} online for free. Preserve ${sourceBenefit} and gain ${targetBenefit}. No registration, no watermarks!`,
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages: {
      es: `https://easyconvertimage.com/es/convert/${sourceFormat}/${targetFormat}`,
      fr: `https://easyconvertimage.com/fr/convert/${sourceFormat}/${targetFormat}`,
      de: `https://easyconvertimage.com/de/convert/${sourceFormat}/${targetFormat}`,
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${sourceFormatUpper} to ${targetFormatUpper} Converter`,
      url: url,
      description: description,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Organization",
        name: "Easy Convert Image",
        url: "https://easyconvertimage.com",
      },
    },
  });
};
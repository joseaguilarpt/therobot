import type { MetaFunction } from "@remix-run/node";
import i18next from "~/i18next.server";

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  alternateLanguages?: Record<string, string>;
  structuredData?: Record<string, any>;
}

const BASE_URL = 'https://easyconvertimage.com';

const languages = ['en', 'es', 'fr', 'de', 'pt', 'nl', 'it', 'id', 'ru']

const getAlternateLanguages = (url: string) => {
  let alternateLanguages: any = {}
    languages.forEach((item) => {
      alternateLanguages[item] = `${BASE_URL}/${item}`
      if (url) {
        alternateLanguages[item] = `${alternateLanguages}/${url}`
      }
    })
    return alternateLanguages;
}

export const createMeta = ({
  ogImage,
  twitterCard = "summary_large_image",
  canonicalUrl,
  alternateLanguages,
  structuredData,
}: MetaProps): MetaFunction => {
  return ({ data }) => {
    const { title = '', description = '', keywords, ogTitle, ogDescription } =
      data as MetaProps;

    const meta: Record<string, string> = {
      title,
      description,
      "og:title": ogTitle || title,
      "og:description": ogDescription || description,
      "twitter:card": twitterCard,
    };

    if (keywords) meta.keywords = keywords;
    if (ogImage) meta["og:image"] = ogImage;

    const links: Array<{ rel: string; href: string; [key: string]: string }> = [
      ...(canonicalUrl ? [{ rel: "canonical", href: canonicalUrl }] : []),
    ];

    if (alternateLanguages) {
      Object.entries(alternateLanguages).forEach(([lang, url]) => {
        links.push({ rel: "alternate", hrefLang: lang, href: url });
      });
    }

    const jsonLD = structuredData
      ? [
          {
            "script:ld+json": JSON.stringify(structuredData),
          },
        ]
      : [];

    return [
      { title },
      ...Object.entries(meta).map(([name, content]) => ({ name, content })),
      ...links,
      ...jsonLD,
    ];
  };
};

export const meta: MetaFunction = ({ data }) => {
  const { description, title, url, alternate } = data as any;
  const alternateLanguages = getAlternateLanguages(alternate)
  return createMeta({
    ogImage: "https://easyconvertimage.com/assets/conversion-tool-og.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: url,
    alternateLanguages,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
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
        url: BASE_URL,
      },
    },
  })({ data });
};
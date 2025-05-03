import type { MetaFunction } from "@remix-run/node";

export interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  path?: string;
  datePublished?: string;
  dateModified?: string;
  alternateLanguages?: Record<string, string>;
  structuredData?: Record<string, unknown>;
  url?: string;
  alternate?: string;
}

const BASE_URL = "https://easyconvertimage.com";

const languages = ["en", "es", "fr", "de", "pt", "nl", "it", "id", "ru"];

const getAlternateLanguages = (path: string): Record<string, string> => {
  const alternateLanguages: Record<string, string> = {};
  languages.forEach((lang) => {
    alternateLanguages[lang] = `${BASE_URL}${lang === 'en' ? '' : `/${lang}`}${path ? `/${path}` : ''}`;
  });
  // Set x-default to the English version
  alternateLanguages['x-default'] = alternateLanguages['en'];
  return alternateLanguages;
};

export const createMeta = ({
  ogImage,
  twitterCard = "summary_large_image",
  canonicalUrl,
  alternateLanguages,
  structuredData,
}: MetaProps): MetaFunction => {
  return ({ data }) => {
    const {
      title = "",
      description = "",
      keywords,
      ogTitle,
      ogDescription,
    } = (data as MetaProps) || {};

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
            "script:ld+json": structuredData,
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

export const meta: MetaFunction = ({ data, params, location, matches }) => {
  if (!data) {
    return [];
  }
  const { description, title, keywords, ogTitle, ogDescription } = (data as MetaProps) || {};
  const lang = params.lang || 'en';
  const path = location.pathname.split('/').slice(lang === 'en' ? 1 : 2).join('/');
  const fullUrl = `${BASE_URL}${lang === 'en' ? '' : `/${lang}`}${path ? `/${path}` : ''}`;
  const alternateLanguages = getAlternateLanguages(path, lang);

  return createMeta({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage: "https://easyconvertimage.com/img/simplify-conversion.jpg",
    twitterCard: "summary_large_image",
    canonicalUrl: fullUrl,
    alternateLanguages,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: fullUrl,
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
  })({ data, params, location, matches });
};
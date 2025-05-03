import type { MetaFunction } from "@remix-run/node";

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

import Backend from "i18next-fs-backend";
import { RemixI18Next } from "remix-i18next/server";
import i18n from "~/i18n"; // your i18n configuration file

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  i18next: {
    ...i18n,
    backend: { 
      loadPath: './locales/{{lng}}/{{ns}}.json',
      addPath: './locales/{{lng}}/{{ns}}.json'
    },
  },
  plugins: [Backend],
});

// Custom function to get locale from URL with fallback
export async function getLocaleWithFallback(request: Request): Promise<string> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const firstPathPart = pathname.split('/')[1];

  if (i18n.supportedLngs.includes(firstPathPart)) {
    return firstPathPart;
  }

  return i18n.fallbackLng;
}

// Override the getLocale method
i18next.getLocale = getLocaleWithFallback;

export default i18next;
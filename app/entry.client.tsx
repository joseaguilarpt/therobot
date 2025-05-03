
// entry.client.tsx
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { getInitialNamespaces } from "remix-i18next/client";
import i18n from "./i18n";

async function hydrate() {
  try {
    console.log("Starting hydration...");

    await i18next
      .use(initReactI18next)
      .use(LanguageDetector)
      .use(Backend)
      .init({
        ...i18n,
        ns: getInitialNamespaces(),
        backend: { 
          loadPath: './locales/{{lng}}/{{ns}}.json',
          addPath: './locales/{{lng}}/{{ns}}.json'
        },
        detection: {
          order: ["htmlTag"],
          caches: [],
        },
        fallbackLng: 'en',
        debug: true,
        interpolation: {
          escapeValue: false,
        },
      });

    startTransition(() => {
      hydrateRoot(
        document,
          <I18nextProvider i18n={i18next}>
            <StrictMode>
              <RemixBrowser />
            </StrictMode>
          </I18nextProvider>
      );
    });

    console.log("Hydration complete");
  } catch (error) {
    
    console.error("Hydration error:", error);
  }
}

hydrate();

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

function detectNamespaceFromURL() {
  const path = window.location.pathname;
  const match = path.match(/\/blog\/([\w-]+)/);
  if (match) {
    return ["common", match[1]]; // Return both 'common' and the specific article namespace
  }
  return ["common"]; // Default namespace
}

const detectedNamespaces = detectNamespaceFromURL();


async function hydrate() {
  try {

    await i18next
      .use(initReactI18next)
      .use(LanguageDetector)
      .use(Backend)
      .init({
        ...i18n,
        ns: [...getInitialNamespaces(), ...detectedNamespaces],
        backend: { 
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
          order: ["htmlTag"],
          caches: [],
        },
        fallbackLng: 'en',
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

  } catch (error) {
    
    console.error("Hydration error:", error);
  }
}

hydrate();
// app/i18n/index.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useState, useEffect } from 'react';

export const supportedLngs = ['en', 'es', 'fr'];
export const defaultNS = 'common';

let i18nInstance: any = null;

export function getI18n() {
  if (!i18nInstance) {
    i18nInstance = i18next.createInstance();
    i18nInstance
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        supportedLngs,
        fallbackLng: 'en',
        ns: [defaultNS],
        defaultNS,
        react: { useSuspense: false },
        interpolation: {
          escapeValue: false,
        },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      });
  }
  return i18nInstance;
}

export function useI18n(locale: string) {
  const [isInitialized, setIsInitialized] = useState(false);
  const i18n = getI18n();

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsInitialized(true);
    } else {
      i18n.on('initialized', () => {
        setIsInitialized(true);
      });
    }
  }, [i18n]);

  useEffect(() => {
    if (isInitialized && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [isInitialized, i18n, locale]);

  return { i18n, isInitialized };
}
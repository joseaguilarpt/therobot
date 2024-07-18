// app/components/LocaleProvider.tsx
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLngs } from '../i18n';
import { useNavigate } from '@remix-run/react';
import { removeLocaleFromPath } from '../utils/LocaleUtils';

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const setLocale = (newLocale: string) => {
    if (supportedLngs.includes(newLocale)) {
      i18n.changeLanguage(newLocale);
      const currentPath = removeLocaleFromPath(window.location.pathname);
      navigate(`/${newLocale}${currentPath}`);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale: i18n.language, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "@remix-run/react";
import InputSelect from "../InputSelect/InputSelect";
import classNames from "classnames";

type Language = {
  id: number;
  value: string;
  label: string;
};

const LanguageSwitcher = ({ keepScrolled }: { keepScrolled?: boolean }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const { t } = useTranslation();

  const languages: Language[] = [
    { id: 1, value: "en", label: t("languages.en") },
    { id: 2, value: "es", label: t("languages.es") },
    { id: 3, value: "pt", label: t("languages.pt") },
    { id: 4, value: "fr", label: t("languages.fr") },
    { id: 5, value: "nl", label: t("languages.nl") },
    { id: 6, value: "de", label: t("languages.de") },
    { id: 7, value: "it", label: t("languages.it") },
    { id: 8, value: "id", label: t("languages.id") },
    { id: 9, value: "ru", label: t("languages.ru") },
  ];

  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode).then(() => {
      setCurrentLang(langCode);

      // Update URL
      const currentPathname = location.pathname;
      const pathParts = currentPathname.split("/").filter(Boolean);

      const supportedLanguages = languages.map((option) => option.value);

      if (supportedLanguages.includes(pathParts[0])) {
        pathParts[0] = langCode;
      } else {
        pathParts.unshift(langCode);
      }

      const newPath = `/${pathParts.join("/")}${location.search}`;
      window.location.href = newPath;
    });
  };

  return (
    <InputSelect
      options={languages}
      className={classNames("navbar__select", keepScrolled && "--contrast")}
      label={t("languageSelector")}
      initialValue={currentLang}
      onSelect={changeLanguage}
    />
  );
};

export default LanguageSwitcher;

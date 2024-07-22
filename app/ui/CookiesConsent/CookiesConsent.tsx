import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import "./CookiesConsent.scss";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";
import ContentContainer from "../ContentContainer/ContentContainer";

type CookiePreferences = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookiesConsent() {
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies([
    "functional_cookies",
    "necessary_cookies",
    "analytics_cookies",
    "marketing_cookies",
  ]);
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });

  const bannerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (cookies.necessary_cookies === undefined) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    } else {
      setPreferences({
        functional: cookies.functional_cookies,
        necessary: cookies.necessary_cookies,
        analytics: cookies.analytics_cookies,
        marketing: cookies.marketing_cookies,
      });
    }
  }, [
    cookies.functional_cookies,
    cookies.necessary_cookies,
    cookies.analytics_cookies,
    cookies.marketing_cookies
  ]);

  const handlePreferenceChange = (category: keyof CookiePreferences) => {
    setPreferences((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Necessary cookies are always set
    setCookie("necessary_cookies", "true", { path: "/", maxAge: 31536000 });

    if (prefs.functional) {
      setCookie("functional_cookies", "true", { path: "/", maxAge: 31536000 });
    } else {
      removeCookie("functional_cookies", { path: "/" });
    }

    if (prefs.analytics) {
      setCookie("analytics_cookies", "true", { path: "/", maxAge: 31536000 });
      // Enable analytics (e.g., Google Analytics)
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    } else {
      removeCookie("analytics_cookies", { path: "/" });
      // Disable analytics
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }

    if (prefs.marketing) {
      setCookie("marketing_cookies", "true", { path: "/", maxAge: 31536000 });
      // Enable marketing cookies (e.g., Facebook Pixel)
      //window.fbq('consent', 'grant');
    } else {
      removeCookie("marketing_cookies", { path: "/" });
      // Disable marketing cookies
      // window.fbq('consent', 'revoke');
    }
  };

  const saveCookiePreferences = () => {
    applyPreferences(preferences);
    setIsVisible(false);
  };

  const acceptAllCookies = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    setCookie("analytics_cookies", allAccepted, {
      path: "/",
      maxAge: 31536000,
    });
    setCookie("functional_cookies", allAccepted, {
      path: "/",
      maxAge: 31536000,
    });
    setCookie("marketing_cookies", allAccepted, {
      path: "/",
      maxAge: 31536000,
    });
    setCookie("necessary_cookies", allAccepted, {
      path: "/",
      maxAge: 31536000,
    });
    applyPreferences(allAccepted);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <dialog
      ref={bannerRef}
      className="cookie-banner"
      open={isVisible}
      aria-labelledby="cookieConsentTitle"
    >
      <ContentContainer>
        <Heading
          level={2}
          appearance={6}
          className="cookie-banner__title"
          id="cookieConsentTitle"
        >
          {t('cookieBanner.title')}
        </Heading>
        <Text>
          {t('cookieBanner.description')}
        </Text>
        <form className="cookie-banner__options u-pt2">
          <fieldset>
            <legend className="visually-hidden">{t('cookieBanner.legend')}</legend>
            <Checkbox
              id="necessary"
              label={t('cookiePreferences.necessary.name')}
              name="necessary"
              checked={true}
              onChange={() => {}}
              disabled={true}
              required={true}
            />
            <Checkbox
              id="functional"
              label={t('cookiePreferences.functional.name')}
              name="functional"
              checked={preferences.functional}
              onChange={() => handlePreferenceChange("functional")}
            />
            <Checkbox
              id="analytics"
              label={t('cookiePreferences.analytics.name')}
              name="analytics"
              checked={preferences.analytics}
              onChange={() => handlePreferenceChange("analytics")}
            />
            <Checkbox
              id="marketing"
              label={t('cookiePreferences.marketing.name')}
              name="marketing"
              checked={preferences.marketing}
              onChange={() => handlePreferenceChange("marketing")}
            />
          </fieldset>
        </form>
        <div className="cookie-banner__buttons">
          <Button
            appareance="outlined"
            className="cookie-banner__button cookie-banner__button--save"
            onClick={saveCookiePreferences}
            aria-label={t('cookieBanner.savePreferencesAriaLabel')}
          >
            {t('cookieBanner.savePreferences')}
          </Button>
          <Button
            className="cookie-banner__button cookie-banner__button--accept-all"
            onClick={acceptAllCookies}
            aria-label={t('cookieBanner.acceptAllAriaLabel')}
          >
            {t('cookieBanner.acceptAll')}
          </Button>
        </div>
      </ContentContainer>
    </dialog>
  );
}

export default CookiesConsent;
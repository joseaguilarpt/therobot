import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import "./CookiesConsent.scss";
import Heading from "../Heading/Heading";
import Text from "../Text/Text";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";

type CookiePreferences = {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookiesConsent() {
  const [cookies, setCookie, removeCookie] = useCookies(["functional_cookies", "necessary_cookies", "analytics_cookies", "marketing_cookies"]);
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  });


  const bannerRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLElement | null>(null);
  const lastFocusableElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (cookies.necessary_cookies === undefined) {
      setTimeout(() => {
        setIsVisible(true);
      }, 1000)
    } else {
      setPreferences({
        functional: cookies.functional_cookies,
        necessary: cookies.necessary_cookies,
        analytics: cookies.analytics_cookies,
        marketing: cookies.marketing_cookies
      });
    }
  }, [cookies.functional_cookies]);

  useEffect(() => {
    if (isVisible && bannerRef.current) {
      const focusableElements = bannerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusableElementRef.current = focusableElements[1] as HTMLElement;
      lastFocusableElementRef.current = focusableElements[focusableElements.length - 1] as HTMLElement;
      firstFocusableElementRef.current.focus();
    }
  }, [isVisible]);

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
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    } else {
      removeCookie("analytics_cookies", { path: "/" });
      // Disable analytics
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsVisible(false);
    }
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstFocusableElementRef.current) {
          event.preventDefault();
          lastFocusableElementRef.current?.focus();
        }
      } else {
        if (document.activeElement === lastFocusableElementRef.current) {
          event.preventDefault();
          firstFocusableElementRef.current?.focus();
        }
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={bannerRef}
      className="cookie-banner" 
      role="dialog" 
      aria-labelledby="cookieConsentTitle"
      onKeyDown={handleKeyDown}
    >
      <div className="cookie-banner__content">
        <Heading level={2} appearance={6} className="cookie-banner__title" id="cookieConsentTitle">
          Cookie Preferences
        </Heading>
        <Text>
          We use cookies to enhance your browsing experience and analyze our
          traffic. Please select your preferences below.
        </Text>
        <form className="cookie-banner__options u-pt2">
          <fieldset>
            <legend className="visually-hidden">Cookie Preferences</legend>
            <Checkbox
              id="necessary"
              label="Necessary (Always active)"
              name="necessary"
              checked={true}
              onChange={() => {}}
              disabled={true}
              required={true}
            />
            <Checkbox
              id="functional"
              label="Functional"
              name="functional"
              checked={preferences.functional}
              onChange={() => handlePreferenceChange('functional')}
            />
            <Checkbox
              id="analytics"
              label="Analytics"
              name="analytics"
              checked={preferences.analytics}
              onChange={() => handlePreferenceChange('analytics')}
            />
            <Checkbox
              id="marketing"
              label="Marketing"
              name="marketing"
              checked={preferences.marketing}
              onChange={() => handlePreferenceChange('marketing')}
            />
          </fieldset>
        </form>
        <div className="cookie-banner__buttons">
          <Button
            appareance="outlined"
            className="cookie-banner__button cookie-banner__button--save"
            onClick={saveCookiePreferences}
            aria-label="Save cookie preferences"
          >
            Save Preferences
          </Button>
          <Button
            className="cookie-banner__button cookie-banner__button--accept-all"
            onClick={acceptAllCookies}
            aria-label="Accept all cookies"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookiesConsent;
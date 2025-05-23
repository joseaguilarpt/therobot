import { useState, useEffect } from "react";
import "./BackToTop.scss";
import Icon from "../Icon/Icon";
import { useTranslation } from "react-i18next";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Focus on the main content area instead of the first focusable element
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    } else {
      // Fallback: focus on the body if main content is not found
      document.body.focus();
    }
  };

  return (
    <button
      data-testid="back-to-top"
      className={`back-to-top ${isVisible ? "visible" : ""}`}
      onClick={handleScrollToTop}
      aria-label={t("ui.backToTop")}
      title={t("ui.backToTop")}
      tabIndex={isVisible ? 0 : -1}
    >
      <Icon icon="keyboard_arrow_up" size="medium" aria-hidden="true" />
      <span className="sr-only">{t("ui.backToTop")}</span>
    </button>
  );
};

export default BackToTop;

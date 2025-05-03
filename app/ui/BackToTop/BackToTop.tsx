import React, { useState, useEffect } from 'react';
import './BackToTop.scss';
import Icon from '../Icon/Icon';
import { useTranslation } from 'react-i18next';

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

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus on the first focusable element in the page
    const firstFocusableElement = document.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={handleScrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <Icon icon='FaArrowUp' size='medium' aria-hidden="true" />
      <span className="sr-only">{t('ui.backToTop')}</span>
    </button>
  );
};

export default BackToTop;
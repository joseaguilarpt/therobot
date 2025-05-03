import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import "./Snackbar.scss";
import { useTheme } from "~/context/ThemeContext";
import Text from "../Text/Text";
import { useTranslation } from "react-i18next";

const Snackbar = () => {
  const { snackbar, hideSnackbar } = useTheme();
  const { t } = useTranslation();
  const snackbarRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const title: any = {
    success: t("ui.success"),
    warning: t("ui.warning"),
    info: t("ui.info"),
    error: t("ui.error"),
  };

  useEffect(() => {
    if (snackbar.message) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      const timer = setTimeout(() => {
        closeSnackbar();
      }, 5000);

      // Focus the snackbar when it appears
      snackbarRef.current?.focus();

      return () => clearTimeout(timer);
    }
  }, [snackbar]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && snackbar.message) {
        closeSnackbar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [snackbar]);

  const closeSnackbar = () => {
    hideSnackbar();
    // Return focus to the previously focused element
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  if (!snackbar.message) return null;

  return (
    <div 
      ref={snackbarRef}
      className={classNames("snackbar", `snackbar--${snackbar.type}`)}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
    >
      <div className="snackbar__message">
        <Text textWeight="bold">{title[snackbar.type]}:</Text>
        <div className="u-pt1">
          <Text textWeight="bold">{snackbar.message}</Text>
        </div>
      </div>
      <button 
        className="snackbar__close" 
        onClick={closeSnackbar}
        aria-label={t("closeSnackbar")}
      >
        ×
      </button>
    </div>
  );
};

export default Snackbar;
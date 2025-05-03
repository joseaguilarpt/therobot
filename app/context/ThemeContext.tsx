import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light-mode" | "dark-mode";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  hideSnackbar: () => void;
  snackbar: {
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
  };
  showSnackbar: (message: string, type: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light-mode");
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  const showSnackbar = React.useCallback((message: string, type: string) => {
    setSnackbar({ message, type });
  }, []);

  const hideSnackbar = React.useCallback(() => {
    setSnackbar({ message: "", type: "" });
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark-mode"
        : "light-mode";
      setTheme(systemPreference);
      document.body.className = systemPreference;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light-mode" ? "dark-mode" : "light-mode";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  const value = React.useMemo(
    () => ({
      theme,
      toggleTheme,
      snackbar,
      showSnackbar,
      hideSnackbar,
    }),
    [snackbar, showSnackbar, hideSnackbar, theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

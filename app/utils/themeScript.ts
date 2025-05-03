// app/utils/theme-script.ts
export const themeScript = `
(function() {
  function getInitialTheme() {
    const persistedTheme = window.localStorage.getItem('theme');
    const hasPersistedTheme = typeof persistedTheme === 'string';

    if (hasPersistedTheme) {
      return persistedTheme;
    }

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const hasMediaQueryPreference = typeof mql.matches === 'boolean';

    if (hasMediaQueryPreference) {
      return mql.matches ? 'dark-mode' : 'light-mode';
    }

    return 'light-mode';
  }

  const theme = getInitialTheme();
  document.body.className = theme;
  window.__theme = theme;
})();
`;
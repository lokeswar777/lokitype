import { useCallback, useEffect, useState } from "react";

// Keep in sync with the inline script in index.html, which applies the theme
// before first paint to avoid a flash of the wrong colors.
export const THEME_STORAGE_KEY = "lokitype-theme";

export const THEMES = ["light", "dark", "glass"];

const LIGHT_QUERY = "(prefers-color-scheme: light)";

const THEME_COLORS = {
  dark: "#0b0f17",
  light: "#f3f5fa",
  glass: "#0b1030",
};

const isTheme = (value) => THEMES.includes(value);

const readStoredTheme = () => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
};

const getSystemTheme = () =>
  window.matchMedia?.(LIGHT_QUERY).matches ? "light" : "dark";

/**
 * Light / Dark / Glass theme state.
 * - Uses the saved choice from localStorage when there is one.
 * - Otherwise follows the OS light/dark preference, including live changes to it.
 */
export function useTheme() {
  const [storedTheme, setStoredTheme] = useState(readStoredTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const theme = storedTheme ?? systemTheme;

  useEffect(() => {
    const media = window.matchMedia?.(LIGHT_QUERY);
    if (!media) return undefined;
    const onChange = (e) => setSystemTheme(e.matches ? "light" : "dark");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (!isTheme(next)) return;
    setStoredTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage may be unavailable (private mode, blocked cookies); the
      // choice still applies for this session.
    }
  }, []);

  return { theme, setTheme };
}

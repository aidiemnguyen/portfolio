"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getCookieTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(/(?:^|; )theme=(dark|light)/);
  return match?.[1] === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  document.cookie = `theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("theme-change", handler);
  return () => window.removeEventListener("theme-change", handler);
}

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const theme = useSyncExternalStore(
    subscribe,
    getCookieTheme,
    () => initialTheme
  );

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      if (stored !== getCookieTheme()) {
        applyTheme(stored);
        window.dispatchEvent(new Event("theme-change"));
        return;
      }
    }
    const onHtml = document.documentElement.getAttribute("data-theme");
    const expected = getCookieTheme();
    if (onHtml !== expected) {
      document.documentElement.setAttribute("data-theme", expected);
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    window.dispatchEvent(new Event("theme-change"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

"use client";

import { useCallback, useEffect, useState } from "react";

export const VOICE_WELCOME_STORAGE_KEY = "voice-welcome-seen";

const WELCOME_DELAY_MS = 1400;
const VOICE_QUERY_OPEN_DELAY_MS = 700;

export function useVoiceWelcome(
  isHomePage: boolean,
  pathname: string,
  onOpenFromQuery: () => void,
) {
  const [showWelcome, setShowWelcome] = useState(false);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    localStorage.setItem(VOICE_WELCOME_STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHomePage) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("voice") === "1") {
      localStorage.setItem(VOICE_WELCOME_STORAGE_KEY, "1");
      window.history.replaceState({}, "", pathname);
      const timer = window.setTimeout(onOpenFromQuery, VOICE_QUERY_OPEN_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    if (localStorage.getItem(VOICE_WELCOME_STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setShowWelcome(true), WELCOME_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isHomePage, onOpenFromQuery, pathname]);

  return { showWelcome, dismissWelcome };
}

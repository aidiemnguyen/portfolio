"use client";

import { useSyncExternalStore } from "react";

const MOBILE_MQ = "(max-width: 768px)";

function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_MQ).matches;
}

/** Matches server/hydration (false), then reflects viewport after hydrate. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export { MOBILE_MQ };

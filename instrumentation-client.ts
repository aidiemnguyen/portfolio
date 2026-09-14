import posthog from "posthog-js";

const token = process.env.POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.host.includes("localhost") ||
    window.location.host.includes("127.0.0.1"));

const enableOnLocalhost =
  process.env.POSTHOG_ENABLE_ON_LOCALHOST === "true";

if (token && (!isLocalhost || enableOnLocalhost)) {
  posthog.init(token, {
    api_host: host,
    ui_host: "https://eu.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    capture_pageview: "history_change",
    capture_pageleave: true,
    external_scripts_inject_target: "head",
    disable_session_recording: isLocalhost,
    debug: isLocalhost && enableOnLocalhost,
  });
}

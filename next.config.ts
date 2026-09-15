import type { NextConfig } from "next";

/** Readable CSS Modules class names (Webpack only — not available under Turbopack). */
const cssModuleIdent = (dev: boolean) =>
  dev ? "[name]__[local]" : "[name]__[local]--[hash:base64:5]";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patchCssModuleLocalIdent(rules: any[], dev: boolean) {
  for (const rule of rules) {
    if (!rule || typeof rule !== "object") continue;

    if (Array.isArray(rule.oneOf)) {
      patchCssModuleLocalIdent(rule.oneOf, dev);
    }

    if (!rule.use) continue;
    const loaders = Array.isArray(rule.use) ? rule.use : [rule.use];

    for (const entry of loaders) {
      if (!entry || typeof entry !== "object") continue;
      const loader =
        typeof entry.loader === "string" ? entry.loader : "";
      if (!loader.includes("css-loader")) continue;
      if (!entry.options?.modules || typeof entry.options.modules !== "object")
        continue;

      entry.options.modules = {
        ...entry.options.modules,
        localIdentName: cssModuleIdent(dev),
      };
    }
  }
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog runs in the browser; values are inlined at build time (not server-only secrets).
  env: {
    POSTHOG_PROJECT_TOKEN:
      process.env.POSTHOG_PROJECT_TOKEN ??
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    POSTHOG_ENABLE_ON_LOCALHOST:
      process.env.POSTHOG_ENABLE_ON_LOCALHOST ??
      process.env.NEXT_PUBLIC_POSTHOG_ENABLE_ON_LOCALHOST ??
      "",
  },
  sassOptions: {
    includePaths: ["./styles"],
  },
  webpack(config, { dev }) {
    patchCssModuleLocalIdent(config.module.rules, dev);
    return config;
  },
};

export default nextConfig;

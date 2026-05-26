import "server-only";

/**
 * Anthropic API key — server-only (Route Handlers, Server Components).
 * Never import this file from `"use client"` components.
 */
export function getAnthropicApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is missing. Add it to .env.local (see .env.example)."
    );
  }
  return apiKey;
}

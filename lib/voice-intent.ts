/** AI-classified turn type (see voice-system-prompt). */
export type VoiceIntent = "command" | "answer" | "both";

const VALID_INTENTS = new Set<VoiceIntent>(["command", "answer", "both"]);

export function isVoiceIntent(value: unknown): value is VoiceIntent {
  return typeof value === "string" && VALID_INTENTS.has(value as VoiceIntent);
}

/** User phrasing that needs a spoken answer — never treat as silent command-only. */
export function looksLikeUserQuestion(message: string): boolean {
  const t = message
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s?]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!t) return false;
  if (t.includes("?")) return true;

  return (
    /\b(tell me|what|who|how|why|when|where|which|explain|describe|can you|could you|would you|do you|are you|is there|anyone|anything)\b/i.test(
      t,
    ) ||
    /\b(cho (tôi )?biết|kể (cho )?tôi|là gì|như thế nào|tại sao|bao nhiêu|bạn có)\b/i.test(
      t,
    )
  );
}

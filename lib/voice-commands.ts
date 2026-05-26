/** Instant local intents — no API (close/stop only). Navigation is decided by the voice API. */

export type LocalVoiceCommand = { type: "close" };

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isCloseCommand(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > 8) return false;

  const closePhrase =
    /^(?:please\s+)?(?:close|stop|dismiss|exit|quit|goodbye|bye|done|never\s*mind|that'?s\s*all|turn\s*off|shut\s*down)(?:\s+(?:the\s+)?(?:voice|assistant|overlay|this|mic|it))?$/i;

  if (closePhrase.test(text)) return true;

  if (
    words.length <= 2 &&
    /^(close|stop|exit|quit|dismiss|đóng|dừng|tắt|thoát|ngừng)$/i.test(text)
  ) {
    return true;
  }

  if (words.length <= 3 && /^cancel(?:\s+that)?$/i.test(text)) return true;

  if (words.length <= 5 && /\b(close|closed|đóng|tắt|thoát)\b/i.test(text)) {
    return true;
  }

  if (
    words.length <= 3 &&
    /\b(stop|exit|quit|dismiss|dừng|ngừng)\b/i.test(text)
  ) {
    return true;
  }

  return false;
}

export function parseLocalVoiceCommand(raw: string): LocalVoiceCommand | null {
  const text = normalize(raw);
  if (!text) return null;
  if (isCloseCommand(text)) return { type: "close" };
  return null;
}

import {
  extractTextFieldFromJson,
  parseVoiceResponse,
} from "@/lib/voice-navigation";

/** Prepare API / JSON text for TTS — spoken words only. */
export function sanitizeForSpeech(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("{")) {
    const fromField = extractTextFieldFromJson(trimmed);
    if (fromField) return fromField;
    return parseVoiceResponse(trimmed).text;
  }

  return trimmed.replace(/\s+/g, " ").trim();
}

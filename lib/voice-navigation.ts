import type { RoadStopId } from "@/data/road-stops";
import type { Locale } from "@/i18n/config";
import {
  isVoiceIntent,
  looksLikeUserQuestion,
  type VoiceIntent,
} from "@/lib/voice-intent";

export const VOICE_PROJECT_SLUGS = [
  "webrtc-video",
  "joblogic-migration",
  "ai-chat",
  "poland-move",
] as const;

export type VoiceProjectSlug = (typeof VOICE_PROJECT_SLUGS)[number];

export type VoiceRoadAction = RoadStopId;

export type VoiceSystemAction =
  | VoiceRoadAction
  | "project_page"
  | "project_step"
  | "road_back"
  | "home"
  | "locale"
  | "theme"
  | "mailto";

export type VoiceAction = VoiceSystemAction | null;

export type VoiceLocale = Locale;
export type VoiceTheme = "light" | "dark";
export type VoiceProjectStep = "next" | "prev";

export const VOICE_NAVIGATE_EVENT = "voice-assistant-navigate";
export const VOICE_PROJECTS_CHAPTER_EVENT = "voice-projects-chapter";
export const VOICE_ROAD_BACK_EVENT = "voice-road-back";
export const VOICE_PROJECT_STEP_EVENT = "voice-project-step";
export const VOICE_PENDING_NAV_KEY = "voice-pending-nav";
export const VOICE_PENDING_CHAPTER_KEY = "voice-pending-chapter";

const CHAPTER_BY_SLUG: Record<VoiceProjectSlug, number> = {
  "webrtc-video": 0,
  "joblogic-migration": 1,
  "ai-chat": 2,
  "poland-move": 3,
};

const ROAD_ACTIONS = new Set<string>([
  "about",
  "projects",
  "approach",
  "stack",
  "contact",
]);

const SYSTEM_ACTIONS = new Set<string>([
  ...ROAD_ACTIONS,
  "project_page",
  "project_step",
  "road_back",
  "home",
  "locale",
  "theme",
  "mailto",
]);

export interface VoiceNavigateDetail {
  action: VoiceRoadAction;
  chapterIndex?: number;
}

export interface VoiceProjectsChapterDetail {
  index: number;
}

export interface VoiceProjectStepDetail {
  direction: 1 | -1;
}

export interface ParsedVoiceResponse {
  intent: VoiceIntent | undefined;
  text: string;
  action: VoiceAction;
  project: VoiceProjectSlug | null | undefined;
  locale: VoiceLocale | null | undefined;
  theme: VoiceTheme | null | undefined;
  step: VoiceProjectStep | null | undefined;
}

export function isRoadAction(
  action: VoiceAction,
): action is VoiceRoadAction {
  return action !== null && ROAD_ACTIONS.has(action);
}

export function actionToStopId(action: VoiceAction): RoadStopId | null {
  if (!action || !ROAD_ACTIONS.has(action)) return null;
  return action as RoadStopId;
}

export function chapterIndexForProjectSlug(
  slug: VoiceProjectSlug | null | undefined,
): number | undefined {
  if (!slug) return undefined;
  return CHAPTER_BY_SLUG[slug];
}

export function dispatchVoiceNavigate(detail: VoiceNavigateDetail) {
  window.dispatchEvent(
    new CustomEvent<VoiceNavigateDetail>(VOICE_NAVIGATE_EVENT, { detail }),
  );
}

export function dispatchProjectsChapter(index: number) {
  window.dispatchEvent(
    new CustomEvent<VoiceProjectsChapterDetail>(VOICE_PROJECTS_CHAPTER_EVENT, {
      detail: { index },
    }),
  );
}

export function dispatchVoiceRoadBack() {
  window.dispatchEvent(new CustomEvent(VOICE_ROAD_BACK_EVENT));
}

export function dispatchVoiceProjectStep(direction: 1 | -1) {
  window.dispatchEvent(
    new CustomEvent<VoiceProjectStepDetail>(VOICE_PROJECT_STEP_EVENT, {
      detail: { direction },
    }),
  );
}

/** Spoken/display copy only — never raw JSON. */
export function cleanVoiceText(text: string): string {
  return text
    .replace(/\\n/g, " ")
    .replace(/\\r/g, " ")
    .replace(/\\t/g, " ")
    .replace(/\\"/g, '"')
    .replace(/[*#`|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractTextFieldFromJson(raw: string): string | null {
  const marker = raw.match(/"text"\s*:\s*"/);
  if (!marker || marker.index === undefined) return null;

  let i = marker.index + marker[0].length;
  let out = "";

  while (i < raw.length) {
    const ch = raw[i];
    if (ch === '"') break;

    if (ch === "\\" && i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next === "n" || next === "r") out += " ";
      else if (next === "t") out += " ";
      else if (next === '"') out += '"';
      else if (next === "\\") out += "\\";
      else out += next;
      i += 2;
      continue;
    }

    out += ch;
    i += 1;
  }

  const cleaned = cleanVoiceText(out);
  return cleaned.length > 0 ? cleaned : null;
}

function trimTruncatedTail(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/[.!?…]$/.test(trimmed)) return trimmed;

  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > 0 && lastSpace > trimmed.length * 0.55) {
    return `${trimmed.slice(0, lastSpace)}…`;
  }
  return trimmed;
}

const PROJECT_SLUG_PATTERN = VOICE_PROJECT_SLUGS.join("|");
const ACTION_PATTERN = [...SYSTEM_ACTIONS].join("|");

function parseActionFromPartial(raw: string): VoiceAction | undefined {
  const actionMatch = raw.match(
    new RegExp(`"action"\\s*:\\s*"(${ACTION_PATTERN})"`),
  );
  if (actionMatch?.[1]) return actionMatch[1] as VoiceSystemAction;
  if (/"action"\s*:\s*null/.test(raw)) return null;
  return undefined;
}

function parseProjectFromPartial(
  raw: string,
): VoiceProjectSlug | null | undefined {
  const slugMatch = raw.match(
    new RegExp(`"project"\\s*:\\s*"(${PROJECT_SLUG_PATTERN})"`),
  );
  if (slugMatch?.[1]) return slugMatch[1] as VoiceProjectSlug;
  if (/"project"\s*:\s*null/.test(raw)) return null;
  return undefined;
}

function parseLocaleFromPartial(raw: string): VoiceLocale | null | undefined {
  const m = raw.match(/"locale"\s*:\s*"(en|pl)"/);
  if (m?.[1]) return m[1] as VoiceLocale;
  if (/"locale"\s*:\s*null/.test(raw)) return null;
  return undefined;
}

function parseThemeFromPartial(raw: string): VoiceTheme | null | undefined {
  const m = raw.match(/"theme"\s*:\s*"(light|dark)"/);
  if (m?.[1]) return m[1] as VoiceTheme;
  if (/"theme"\s*:\s*null/.test(raw)) return null;
  return undefined;
}

function parseStepFromPartial(
  raw: string,
): VoiceProjectStep | null | undefined {
  const m = raw.match(/"step"\s*:\s*"(next|prev)"/);
  if (m?.[1]) return m[1] as VoiceProjectStep;
  if (/"step"\s*:\s*null/.test(raw)) return null;
  return undefined;
}

function parseIntentFromPartial(raw: string): VoiceIntent | undefined {
  const m = raw.match(/"intent"\s*:\s*"(command|answer|both)"/);
  if (m?.[1] && isVoiceIntent(m[1])) return m[1];
  return undefined;
}

function isValidProjectSlug(value: unknown): value is VoiceProjectSlug {
  return (
    typeof value === "string" &&
    (VOICE_PROJECT_SLUGS as readonly string[]).includes(value)
  );
}

export function parseVoiceResponse(raw: string): ParsedVoiceResponse {
  const trimmed = raw.trim();

  try {
    const json = JSON.parse(trimmed) as {
      intent?: string;
      text?: string;
      action?: string;
      project?: string | null;
      locale?: string | null;
      theme?: string | null;
      step?: string | null;
    };
    if (typeof json.text === "string") {
      let action: VoiceAction = null;
      if (json.action === null || json.action === undefined) {
        action = null;
      } else if (SYSTEM_ACTIONS.has(json.action)) {
        action = json.action as VoiceSystemAction;
      }
      return {
        intent: isVoiceIntent(json.intent) ? json.intent : undefined,
        text: cleanVoiceText(json.text),
        action,
        project: isValidProjectSlug(json.project)
          ? json.project
          : json.project === null
            ? null
            : undefined,
        locale:
          json.locale === "en" || json.locale === "pl"
            ? json.locale
            : json.locale === null
              ? null
              : undefined,
        theme:
          json.theme === "light" || json.theme === "dark"
            ? json.theme
            : json.theme === null
              ? null
              : undefined,
        step:
          json.step === "next" || json.step === "prev"
            ? json.step
            : json.step === null
              ? null
              : undefined,
      };
    }
  } catch {
    /* partial / truncated JSON */
  }

  const fromField = extractTextFieldFromJson(trimmed);
  const intent = parseIntentFromPartial(trimmed);
  const action = parseActionFromPartial(trimmed);
  const project = parseProjectFromPartial(trimmed);
  const locale = parseLocaleFromPartial(trimmed);
  const theme = parseThemeFromPartial(trimmed);
  const step = parseStepFromPartial(trimmed);

  if (
    fromField ||
    intent !== undefined ||
    action !== undefined ||
    project !== undefined ||
    locale !== undefined ||
    theme !== undefined ||
    step !== undefined
  ) {
    return {
      intent,
      text: fromField ? trimTruncatedTail(fromField) : "",
      action: action ?? null,
      project,
      locale,
      theme,
      step,
    };
  }

  return {
    intent: undefined,
    text: "",
    action: null,
    project: undefined,
    locale: undefined,
    theme: undefined,
    step: undefined,
  };
}

/** Silent UI-only turn: AI said command, or legacy empty text without question phrasing. */
export function isActionOnlyResponse(
  parsed: ParsedVoiceResponse,
  userMessage: string,
): boolean {
  if (!canExecuteFromParsed(parsed)) return false;
  if (parsed.intent === "answer" || parsed.intent === "both") return false;
  if (looksLikeUserQuestion(userMessage)) return false;

  if (parsed.intent === "command") {
    return parsed.text.trim().length === 0;
  }

  return parsed.text.trim().length === 0;
}

/** Whether to run site action after the user has heard/read the reply. */
export function shouldExecuteVoiceAction(
  parsed: ParsedVoiceResponse,
  userMessage: string,
): boolean {
  if (!canExecuteFromParsed(parsed)) return false;
  if (parsed.intent === "answer") return false;
  if (parsed.intent === "command" || parsed.intent === "both") return true;
  if (looksLikeUserQuestion(userMessage) && parsed.text.trim().length === 0) {
    return false;
  }
  return true;
}

/** Stream has enough fields to run the chosen action. */
export function canExecuteFromParsed(parsed: ParsedVoiceResponse): boolean {
  if (!parsed.action) return false;

  switch (parsed.action) {
    case "projects":
      return parsed.project !== undefined;
    case "project_page":
      return parsed.project !== undefined && parsed.project !== null;
    case "locale":
      return parsed.locale !== undefined && parsed.locale !== null;
    case "theme":
      return parsed.theme !== undefined && parsed.theme !== null;
    case "project_step":
      return parsed.step !== undefined && parsed.step !== null;
    default:
      return true;
  }
}

/** @deprecated use canExecuteFromParsed */
export const canNavigateFromParsed = canExecuteFromParsed;

export function extractStreamingText(accumulated: string): string {
  return extractTextFieldFromJson(accumulated) ?? "";
}

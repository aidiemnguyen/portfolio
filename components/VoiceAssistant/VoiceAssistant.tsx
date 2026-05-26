"use client";

import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import { parseLocalVoiceCommand } from "@/lib/voice-commands";
import { pathForLocale } from "@/lib/locale-path";
import type { Locale } from "@/i18n/config";
import {
  canExecuteFromParsed,
  chapterIndexForProjectSlug,
  dispatchVoiceNavigate,
  dispatchVoiceProjectStep,
  dispatchVoiceRoadBack,
  extractStreamingText,
  isActionOnlyResponse,
  isRoadAction,
  parseVoiceResponse,
  VOICE_PENDING_NAV_KEY,
  type ParsedVoiceResponse,
  type VoiceNavigateDetail,
} from "@/lib/voice-navigation";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { VoiceFab } from "./VoiceFab";
import { VoiceOverlay, type OverlayPhase } from "./VoiceOverlay";
import styles from "./VoiceAssistant.module.css";

const TOOLTIP_STORAGE_KEY = "voice-assistant-tooltip-seen";
const NAV_DELAY_MS = 1000;
const CONTACT_EMAIL = "aidiemnguyen2104@gmail.com";

const OFFLINE_MESSAGE =
  "Looks like you're offline — you can still explore the road.";
const API_ERROR_MESSAGE =
  "Sorry, I had trouble connecting. Try again or email me directly.";

type AssistantPhase = "idle" | "listening" | "thinking" | "responding";

export function VoiceAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const [phase, setPhase] = useState<AssistantPhase>("idle");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [typingKey, setTypingKey] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [textInput, setTextInput] = useState("");

  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendMessageRef = useRef<(message: string) => Promise<void>>(
    async () => {},
  );
  const closeOverlayRef = useRef<() => void>(() => {});
  const resumeListeningRef = useRef<() => void>(() => {});
  const overlayOpenRef = useRef(false);
  const phaseRef = useRef<AssistantPhase>("idle");
  const hasHadTurnRef = useRef(false);
  const turnIdRef = useRef(0);
  const showTextInputRef = useRef(false);

  const setAssistantPhase = useCallback((next: AssistantPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearNavTimer = useCallback(() => {
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
  }, []);

  const resumeListening = useCallback(() => {
    if (!overlayOpenRef.current || showTextInputRef.current) return;
    setAssistantPhase("listening");
    setTranscript("");
    startListeningRef.current();
  }, [setAssistantPhase]);

  const finishTurn = useCallback(() => {
    if (overlayOpenRef.current) {
      resumeListeningRef.current();
    }
  }, []);

  const onListeningEnd = useCallback((text: string) => {
    if (!overlayOpenRef.current) return;

    const trimmed = text.trim();
    if (trimmed) {
      if (parseLocalVoiceCommand(trimmed)) {
        runLocalCommandRef.current();
        return;
      }
      if (phaseRef.current !== "listening") return;
      void sendMessageRef.current(trimmed);
      return;
    }

    if (phaseRef.current !== "listening") return;

    if (hasHadTurnRef.current) {
      resumeListeningRef.current();
    } else {
      closeOverlayRef.current();
    }
  }, []);

  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    error: micError,
    setTranscript,
  } = useSpeechRecognition(onListeningEnd);

  const startListeningRef = useRef(startListening);

  const { speak, cancel, isSpeaking, spokenCharIndex } = useSpeechSynthesis();

  const locale = (pathname.split("/").filter(Boolean)[0] ?? "en") as Locale;
  const homePath = `/${locale}`;

  const showTextInput =
    !isSupported || micError === "Microphone permission denied.";

  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  useEffect(() => {
    showTextInputRef.current = showTextInput;
  }, [showTextInput]);

  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
  }, [overlayOpen]);

  useEffect(() => {
    resumeListeningRef.current = resumeListening;
  }, [resumeListening]);

  const closeOverlay = useCallback(() => {
    clearNavTimer();
    abortRef.current?.abort();
    cancel();
    stopListening(false);
    setOverlayOpen(false);
    setStreamText("");
    setAssistantPhase("idle");
    setTextInput("");
    hasHadTurnRef.current = false;
    turnIdRef.current += 1;
  }, [cancel, clearNavTimer, setAssistantPhase, stopListening]);

  const runRoadNavigation = useCallback(
    (parsed: ParsedVoiceResponse) => {
      if (!parsed.action || !isRoadAction(parsed.action)) return;

      const chapterIndex =
        parsed.action === "projects"
          ? chapterIndexForProjectSlug(parsed.project)
          : undefined;

      const detail: VoiceNavigateDetail = {
        action: parsed.action,
        ...(chapterIndex !== undefined ? { chapterIndex } : {}),
      };

      const onHome =
        pathname === homePath || pathname === `${homePath}/`;

      if (!onHome) {
        sessionStorage.setItem(VOICE_PENDING_NAV_KEY, JSON.stringify(detail));
        router.push(homePath);
        return;
      }

      dispatchVoiceNavigate(detail);
    },
    [homePath, pathname, router],
  );

  const executeVoiceAction = useCallback(
    (parsed: ParsedVoiceResponse) => {
      if (!parsed.action) return;

      switch (parsed.action) {
        case "locale":
          if (parsed.locale) {
            router.push(pathForLocale(pathname, parsed.locale));
          }
          return;
        case "theme":
          if (parsed.theme) setTheme(parsed.theme);
          return;
        case "road_back":
          dispatchVoiceRoadBack();
          return;
        case "home": {
          const onHome =
            pathname === homePath || pathname === `${homePath}/`;
          if (!onHome) router.push(homePath);
          dispatchVoiceRoadBack();
          return;
        }
        case "project_page":
          if (parsed.project) {
            router.push(`${homePath}/projects/${parsed.project}`);
          }
          return;
        case "project_step":
          if (parsed.step === "next") dispatchVoiceProjectStep(1);
          else if (parsed.step === "prev") dispatchVoiceProjectStep(-1);
          return;
        case "mailto":
          window.location.href = `mailto:${CONTACT_EMAIL}`;
          return;
        default:
          if (isRoadAction(parsed.action)) {
            runRoadNavigation(parsed);
          }
      }
    },
    [homePath, pathname, router, runRoadNavigation, setTheme],
  );

  const runLocalCommand = useCallback(() => {
    abortRef.current?.abort();
    cancel();
    stopListening(false);
    clearNavTimer();
    closeOverlay();
  }, [cancel, clearNavTimer, closeOverlay, stopListening]);

  const runLocalCommandRef = useRef(runLocalCommand);

  useEffect(() => {
    runLocalCommandRef.current = runLocalCommand;
  }, [runLocalCommand]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed) return;

      if (parseLocalVoiceCommand(trimmed)) {
        runLocalCommand();
        return;
      }

      const thisTurn = ++turnIdRef.current;
      hasHadTurnRef.current = true;

      abortRef.current?.abort();
      cancel();
      stopListening(false);

      setStreamText("");
      setTypingKey((k) => k + 1);
      setAssistantPhase("thinking");
      clearNavTimer();

      if (!navigator.onLine) {
        setAssistantPhase("responding");
        setStreamText(OFFLINE_MESSAGE);
        speak(OFFLINE_MESSAGE, () => {
          if (thisTurn === turnIdRef.current) finishTurn();
        });
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      let accumulated = "";
      const execScheduledRef = { done: false };

      const scheduleExecution = (parsed: ParsedVoiceResponse) => {
        if (
          !canExecuteFromParsed(parsed) ||
          execScheduledRef.done ||
          isActionOnlyResponse(parsed)
        ) {
          return;
        }

        execScheduledRef.done = true;
        navTimerRef.current = setTimeout(() => {
          executeVoiceAction(parsed);
        }, NAV_DELAY_MS);
      };

      try {
        const res = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("api");
        }

        if (!res.body) {
          throw new Error("stream");
        }

        if (thisTurn !== turnIdRef.current) return;

        setAssistantPhase("responding");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (thisTurn !== turnIdRef.current) return;

          accumulated += decoder.decode(value, { stream: true });
          setStreamText(extractStreamingText(accumulated));
          scheduleExecution(parseVoiceResponse(accumulated));
        }

        if (thisTurn !== turnIdRef.current) return;

        const parsed = parseVoiceResponse(accumulated);

        if (isActionOnlyResponse(parsed)) {
          executeVoiceAction(parsed);
          closeOverlay();
          return;
        }

        const answer = parsed.text || "…";
        setStreamText(answer);

        if (!answer || answer === "…") {
          finishTurn();
          return;
        }

        speak(answer, () => {
          if (thisTurn === turnIdRef.current) finishTurn();
        });

        scheduleExecution(parsed);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        if (thisTurn !== turnIdRef.current) return;

        setAssistantPhase("responding");
        setStreamText(API_ERROR_MESSAGE);
        speak(API_ERROR_MESSAGE, () => {
          if (thisTurn === turnIdRef.current) finishTurn();
        });
      }
    },
    [
      cancel,
      clearNavTimer,
      closeOverlay,
      executeVoiceAction,
      finishTurn,
      runLocalCommand,
      setAssistantPhase,
      speak,
      stopListening,
    ],
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    closeOverlayRef.current = closeOverlay;
  }, [closeOverlay]);

  const openOverlay = useCallback(() => {
    hasHadTurnRef.current = false;
    turnIdRef.current += 1;
    setOverlayOpen(true);
    setStreamText("");
    setTextInput("");

    if (showTextInput) {
      setAssistantPhase("listening");
      return;
    }

    setAssistantPhase("listening");
    startListening();
  }, [setAssistantPhase, showTextInput, startListening]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(TOOLTIP_STORAGE_KEY)) return;

    const showTimer = setTimeout(() => setShowTooltip(true), 4000);
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
      localStorage.setItem(TOOLTIP_STORAGE_KEY, "1");
    }, 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const dismissTooltip = useCallback(() => {
    setShowTooltip(false);
    localStorage.setItem(TOOLTIP_STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    return () => {
      clearNavTimer();
      abortRef.current?.abort();
    };
  }, [clearNavTimer]);

  const overlayPhase: OverlayPhase | null =
    phase === "idle" ? null : phase;

  return (
    <div className={styles.root}>
      <AnimatePresence>
        {showTooltip && !overlayOpen && (
          <motion.button
            type="button"
            className={styles.tooltip}
            onClick={dismissTooltip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
          >
            Not sure where to start? Ask me anything ↓
          </motion.button>
        )}
      </AnimatePresence>

      {!overlayOpen && (
        <VoiceFab onClick={openOverlay} ariaLabel="Open voice assistant" />
      )}

      <VoiceOverlay
        open={overlayOpen}
        phase={overlayPhase}
        isListening={isListening && phase === "listening"}
        transcript={transcript}
        streamText={streamText}
        typingKey={typingKey}
        isSpeaking={isSpeaking}
        spokenCharIndex={spokenCharIndex}
        showTextInput={showTextInput}
        textInputValue={textInput}
        onTextInputChange={setTextInput}
        onTextSubmit={(msg) => {
          setTranscript("");
          void sendMessage(msg);
          setTextInput("");
        }}
        onClose={closeOverlay}
      />
    </div>
  );
}

"use client";

import { useTheme } from "@/components/ThemeProvider/ThemeProvider";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { useVoiceResponse } from "@/contexts/VoiceResponseContext";
import { parseLocalVoiceCommand } from "@/lib/voice-commands";
import { pathForLocale } from "@/lib/locale-path";
import { openPrintResume } from "@/lib/print-resume";
import { speechLangForLocale } from "@/lib/speech-locale";
import type { Locale } from "@/i18n/config";
import {
  chapterIndexForProjectSlug,
  dispatchVoiceNavigate,
  dispatchVoiceProjectStep,
  dispatchVoiceRoadBack,
  extractStreamingText,
  isActionOnlyResponse,
  isRoadAction,
  parseVoiceResponse,
  sectionForVoiceAction,
  shouldExecuteVoiceAction,
  shouldTransferVoiceToSection,
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
import { SectionVoiceReply } from "./SectionVoiceReply";
import styles from "./VoiceAssistant.module.css";

const TOOLTIP_STORAGE_KEY = "voice-assistant-tooltip-seen";
const NAV_DELAY_MS = 1000;

type AssistantPhase = "idle" | "listening" | "thinking" | "responding";

type VoiceHandlers = {
  sendMessage: (message: string) => Promise<void>;
  closeOverlay: () => void;
  resumeListening: () => void;
  runLocalCommand: () => void;
};

export function VoiceAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const { dictionary, locale } = useLocaleContext();
  const speechLang = speechLangForLocale(locale);
  const voice = dictionary.voice;
  const { setTheme } = useTheme();
  const {
    activateSection,
    setSectionPhase,
    setSectionText,
    syncSpeech,
    clearSectionResponse,
    isSectionReplyVisible,
  } = useVoiceResponse();

  const [phase, setPhase] = useState<AssistantPhase>("idle");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [typingKey, setTypingKey] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [textInput, setTextInput] = useState("");

  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const handlersRef = useRef<VoiceHandlers>({
    sendMessage: async () => {},
    closeOverlay: () => {},
    resumeListening: () => {},
    runLocalCommand: () => {},
  });
  const overlayOpenRef = useRef(false);
  const phaseRef = useRef<AssistantPhase>("idle");
  const hasHadTurnRef = useRef(false);
  const turnIdRef = useRef(0);
  const showTextInputRef = useRef(false);
  const sectionNavModeRef = useRef(false);

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

  const onListeningEnd = useCallback((text: string) => {
    if (!overlayOpenRef.current) return;

    const trimmed = text.trim();
    if (trimmed) {
      if (parseLocalVoiceCommand(trimmed)) {
        handlersRef.current.runLocalCommand();
        return;
      }
      if (phaseRef.current !== "listening") return;
      void handlersRef.current.sendMessage(trimmed);
      return;
    }

    if (phaseRef.current !== "listening") return;

    if (hasHadTurnRef.current) {
      handlersRef.current.resumeListening();
    } else {
      handlersRef.current.closeOverlay();
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
  } = useSpeechRecognition(onListeningEnd, speechLang);

  const { speak, cancel, isSpeaking, spokenCharIndex } = useSpeechSynthesis();

  const homePath = `/${locale}`;

  const showTextInput =
    !isSupported || micError === "Microphone permission denied.";

  useEffect(() => {
    showTextInputRef.current = showTextInput;
  }, [showTextInput]);

  useEffect(() => {
    overlayOpenRef.current = overlayOpen;
  }, [overlayOpen]);

  const closeOverlay = useCallback(() => {
    sectionNavModeRef.current = false;
    clearSectionResponse();
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
  }, [cancel, clearNavTimer, clearSectionResponse, setAssistantPhase, stopListening]);

  const dismissOverlayForSectionNav = useCallback(() => {
    clearNavTimer();
    stopListening(false);
    setOverlayOpen(false);
    setTextInput("");
  }, [clearNavTimer, stopListening]);

  const resumeListening = useCallback(() => {
    if (!overlayOpenRef.current || showTextInputRef.current) return;
    setAssistantPhase("listening");
    setTranscript("");
    startListening();
  }, [setAssistantPhase, setTranscript, startListening]);

  const finishTurn = useCallback(() => {
    if (overlayOpenRef.current) {
      resumeListening();
    }
  }, [resumeListening]);

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
          window.location.href = `mailto:${dictionary.contact.email}`;
          return;
        case "print_pdf": {
          const targetLocale = (parsed.locale ?? locale) as Locale;
          if (parsed.locale && parsed.locale !== locale) {
            window.open(
              `/${parsed.locale}/resume?print=1`,
              "_blank",
              "noopener,noreferrer",
            );
          } else {
            openPrintResume(locale);
          }
          return;
        }
        default:
          if (isRoadAction(parsed.action)) {
            runRoadNavigation(parsed);
          }
      }
    },
    [dictionary.contact.email, homePath, pathname, router, runRoadNavigation, setTheme],
  );

  const enterSectionNavMode = useCallback(
    (parsed: ParsedVoiceResponse, streamTextValue: string) => {
      const sectionId = sectionForVoiceAction(parsed.action);
      if (!sectionId || sectionNavModeRef.current) return false;

      sectionNavModeRef.current = true;
      dismissOverlayForSectionNav();
      activateSection(sectionId);
      if (streamTextValue) {
        setSectionPhase("responding");
        setSectionText(streamTextValue);
      } else {
        setSectionPhase("thinking");
      }
      executeVoiceAction(parsed);
      return true;
    },
    [
      activateSection,
      dismissOverlayForSectionNav,
      executeVoiceAction,
      setSectionPhase,
      setSectionText,
    ],
  );

  const runLocalCommand = useCallback(() => {
    abortRef.current?.abort();
    cancel();
    stopListening(false);
    clearNavTimer();
    closeOverlay();
  }, [cancel, clearNavTimer, closeOverlay, stopListening]);

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
      sectionNavModeRef.current = false;
      clearSectionResponse();

      abortRef.current?.abort();
      cancel();
      stopListening(false);

      setStreamText("");
      setTypingKey((k) => k + 1);
      setAssistantPhase("thinking");
      clearNavTimer();

      if (!navigator.onLine) {
        setAssistantPhase("responding");
        setStreamText(voice.offline);
        speak(voice.offline, () => {
          if (thisTurn === turnIdRef.current) finishTurn();
        }, { lang: speechLang });
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      let accumulated = "";
      const execScheduledRef = { done: false };

      const scheduleExecution = (parsed: ParsedVoiceResponse) => {
        if (
          execScheduledRef.done ||
          !shouldExecuteVoiceAction(parsed, trimmed) ||
          isActionOnlyResponse(parsed, trimmed)
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
          body: JSON.stringify({ message: trimmed, locale }),
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
          const parsed = parseVoiceResponse(accumulated);
          const streamedText = extractStreamingText(accumulated);

          if (
            shouldTransferVoiceToSection(parsed, trimmed) &&
            !sectionNavModeRef.current
          ) {
            if (enterSectionNavMode(parsed, streamedText)) {
              execScheduledRef.done = true;
            }
          } else if (sectionNavModeRef.current) {
            setSectionText(streamedText);
            if (streamedText) setSectionPhase("responding");
          } else {
            setStreamText(streamedText);
            scheduleExecution(parsed);
          }
        }

        if (thisTurn !== turnIdRef.current) return;

        const parsed = parseVoiceResponse(accumulated);

        if (isActionOnlyResponse(parsed, trimmed)) {
          executeVoiceAction(parsed);
          closeOverlay();
          return;
        }

        const answer = parsed.text || "…";

        if (
          !sectionNavModeRef.current &&
          shouldTransferVoiceToSection(parsed, trimmed)
        ) {
          enterSectionNavMode(parsed, answer);
        }

        if (sectionNavModeRef.current) {
          setSectionText(answer);
          setSectionPhase("responding");

          if (!answer || answer === "…") {
            sectionNavModeRef.current = false;
            clearSectionResponse();
            return;
          }

          speak(answer, () => {
            if (thisTurn === turnIdRef.current) {
              sectionNavModeRef.current = false;
              clearSectionResponse();
            }
          }, { lang: speechLang });
          return;
        }

        setStreamText(answer);

        if (!answer || answer === "…") {
          finishTurn();
          return;
        }

        speak(answer, () => {
          if (thisTurn === turnIdRef.current) finishTurn();
        }, { lang: speechLang });

        scheduleExecution(parsed);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        if (thisTurn !== turnIdRef.current) return;

        setAssistantPhase("responding");
        setStreamText(voice.apiError);
        speak(voice.apiError, () => {
          if (thisTurn === turnIdRef.current) finishTurn();
        }, { lang: speechLang });
      }
    },
    [
      cancel,
      clearNavTimer,
      clearSectionResponse,
      closeOverlay,
      enterSectionNavMode,
      executeVoiceAction,
      finishTurn,
      locale,
      runLocalCommand,
      setAssistantPhase,
      setSectionPhase,
      setSectionText,
      speak,
      speechLang,
      stopListening,
      voice.apiError,
      voice.offline,
    ],
  );

  useEffect(() => {
    handlersRef.current = {
      sendMessage,
      closeOverlay,
      resumeListening,
      runLocalCommand,
    };
  }, [sendMessage, closeOverlay, resumeListening, runLocalCommand]);

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
    if (!sectionNavModeRef.current) return;
    syncSpeech(isSpeaking, spokenCharIndex);
  }, [isSpeaking, spokenCharIndex, syncSpeech]);

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
            {voice.tooltip}
          </motion.button>
        )}
      </AnimatePresence>

      {!overlayOpen && !isSectionReplyVisible && (
        <VoiceFab onClick={openOverlay} ariaLabel={voice.fabAria} />
      )}

      <SectionVoiceReply />

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
        labels={voice}
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

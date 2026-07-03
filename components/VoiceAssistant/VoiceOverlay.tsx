"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useRef } from "react";
import type { Dictionary } from "@/i18n/types";
import { TypingText } from "./TypingText";
import styles from "./VoiceAssistant.module.css";

export type OverlayPhase = "listening" | "thinking" | "responding";

interface VoiceOverlayProps {
  open: boolean;
  phase: OverlayPhase | null;
  /** Mic on (including follow-up / interrupt while assistant works). */
  isListening: boolean;
  transcript: string;
  streamText: string;
  /** Remount typing animation for each new answer. */
  typingKey: number;
  isSpeaking: boolean;
  spokenCharIndex: number;
  showTextInput: boolean;
  textInputValue: string;
  labels: Dictionary["voice"];
  onTextInputChange: (value: string) => void;
  onTextSubmit: (message: string) => void;
  onClose: () => void;
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

export function VoiceOverlay({
  open,
  phase,
  isListening,
  transcript,
  streamText,
  typingKey,
  isSpeaking,
  spokenCharIndex,
  showTextInput,
  textInputValue,
  labels,
  onTextInputChange,
  onTextSubmit,
  onClose,
}: VoiceOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isThinking = phase === "thinking";
  const isResponding = phase === "responding";
  const showListeningUi = isListening && !isThinking;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open && showTextInput) {
      inputRef.current?.focus();
    }
  }, [open, showTextInput]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = textInputValue.trim();
    if (trimmed) onTextSubmit(trimmed);
  };

  const statusLine = showTextInput
    ? labels.typeQuestion
    : showListeningUi
      ? transcript || labels.speakHint
      : isThinking
        ? labels.thinking
        : isResponding
          ? isSpeaking || spokenCharIndex > 0
            ? ""
            : "…"
          : "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={labels.dialogAria}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            className={styles.overlayClose}
            onClick={onClose}
            aria-label={labels.closeAria}
          >
            <span className={styles.overlayCloseIcon} aria-hidden>
              ×
            </span>
            <span className={styles.overlayCloseLabel}>{labels.close}</span>
          </button>

          <div className={styles.overlayContent}>
            {showTextInput ? (
              <div className={styles.overlayFallback}>
                <p className={styles.overlayHint}>{labels.micUnavailable}</p>
                <form className={styles.fallbackForm} onSubmit={handleSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.fallbackInput}
                    value={textInputValue}
                    onChange={(e) => onTextInputChange(e.target.value)}
                    placeholder={labels.inputPlaceholder}
                    aria-label={labels.inputAria}
                  />
                  <button type="submit" className={styles.fallbackSend}>
                    {labels.send}
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.micStage}>
                <div
                  className={`${styles.rings} ${showListeningUi ? styles.ringsActive : ""} ${isThinking ? styles.ringsThinking : ""} ${isResponding && !showListeningUi ? styles.ringsResponding : ""}`}
                  aria-hidden
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className={styles.ring}
                      animate={
                        isListening
                          ? {
                              scale: [1, 1.55 + i * 0.12],
                              opacity: [0.55 - i * 0.12, 0],
                            }
                          : isThinking
                            ? { scale: [1, 1.25], opacity: [0.35, 0.15] }
                            : isResponding
                              ? {
                                  scale: [1, 1.4 + i * 0.08],
                                  opacity: [0.45, 0.08],
                                }
                              : { scale: 1, opacity: 0.3 }
                      }
                      transition={{
                        duration: isListening ? 1.8 : 2.4,
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                <div
                  className={`${styles.micHero} ${showListeningUi ? styles.micHeroListening : ""} ${isThinking ? styles.micHeroThinking : ""} ${isResponding && !showListeningUi ? styles.micHeroResponding : ""}`}
                >
                  {isThinking ? (
                    <span className={styles.dots} aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className={styles.dot}
                          animate={{ opacity: [0.35, 1, 0.35], y: [0, -6, 0] }}
                          transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.18,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    <MicIcon className={styles.micHeroIcon} />
                  )}
                </div>
              </div>
            )}

            <div className={styles.overlayText} aria-live="polite">
              {isResponding && streamText ? (
                <TypingText
                  key={typingKey}
                  text={streamText}
                  active={isResponding}
                  isSpeaking={isSpeaking}
                  spokenCharIndex={spokenCharIndex}
                  className={styles.responseText}
                />
              ) : (
                <p
                  className={`${styles.statusLine} ${transcript && showListeningUi ? styles.statusTranscript : ""}`}
                >
                  {statusLine}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

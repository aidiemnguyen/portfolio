"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./VoiceAssistant.module.css";

interface TypingTextProps {
  text: string;
  active: boolean;
  isSpeaking?: boolean;
  spokenCharIndex?: number;
  className?: string;
}

/**
 * Reveals text in sync with TTS (speechSynthesis boundary events).
 * Hidden until speech starts; full text after speech ends.
 */
export function TypingText({
  text,
  active,
  isSpeaking = false,
  spokenCharIndex = 0,
  className,
}: TypingTextProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (!active || !text) return null;

  const displayLength = reduceMotion
    ? text.length
    : isSpeaking
      ? Math.min(spokenCharIndex, text.length)
      : spokenCharIndex >= text.length
        ? text.length
        : 0;

  if (displayLength === 0) return null;

  const visible = text.slice(0, displayLength);
  const isTyping = displayLength < text.length;

  return (
    <p className={className}>
      <span className={styles.typingContent}>{visible}</span>
      {isTyping && (
        <span className={styles.typingCaret} aria-hidden>
          |
        </span>
      )}
    </p>
  );
}

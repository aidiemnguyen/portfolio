"use client";

import { sanitizeForSpeech } from "@/lib/speech-text";
import { useCallback, useRef, useState } from "react";

const SPEECH_RATE = 0.9;
const SPEECH_PITCH = 1;

/** ~14 chars/sec at rate 1.0 — fallback when boundary events are missing. */
function estimateSpeechDurationMs(text: string, rate: number): number {
  return (text.length / 14) * (1000 / rate) + 200;
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenCharIndex, setSpokenCharIndex] = useState(0);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boundarySeenRef = useRef(false);

  const clearFallback = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    clearFallback();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpokenCharIndex(0);
    boundarySeenRef.current = false;
  }, [clearFallback]);

  const startFallbackSync = useCallback(
    (text: string) => {
      clearFallback();
      const duration = estimateSpeechDurationMs(text, SPEECH_RATE);
      const started = performance.now();

      fallbackTimerRef.current = setInterval(() => {
        const elapsed = performance.now() - started;
        const ratio = Math.min(1, elapsed / duration);
        setSpokenCharIndex(Math.ceil(text.length * ratio));
        if (ratio >= 1) clearFallback();
      }, 40);
    },
    [clearFallback],
  );

  const speak = useCallback(
    (text: string, onEnd?: () => void, options?: { lang?: string }) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        onEnd?.();
        return;
      }

      const clean = sanitizeForSpeech(text);
      if (!clean) {
        onEnd?.();
        return;
      }

      cancel();
      boundarySeenRef.current = false;
      setSpokenCharIndex(0);

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = SPEECH_RATE;
      utterance.pitch = SPEECH_PITCH;
      utterance.volume = 1;
      utterance.lang =
        options?.lang ?? document.documentElement.lang ?? "en-US";

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpokenCharIndex(0);
        window.setTimeout(() => {
          if (!boundarySeenRef.current) startFallbackSync(clean);
        }, 400);
      };

      utterance.onboundary = (event) => {
        boundarySeenRef.current = true;
        clearFallback();
        const end = event.charIndex + (event.charLength ?? 1);
        setSpokenCharIndex((prev) =>
          Math.max(prev, Math.min(end, clean.length)),
        );
      };

      utterance.onend = () => {
        clearFallback();
        setIsSpeaking(false);
        setSpokenCharIndex(clean.length);
        onEnd?.();
      };

      utterance.onerror = () => {
        clearFallback();
        setIsSpeaking(false);
        setSpokenCharIndex(clean.length);
        onEnd?.();
      };

      if (synth.paused) synth.resume();
      synth.speak(utterance);
    },
    [cancel, clearFallback, startFallbackSync],
  );

  return { speak, cancel, isSpeaking, spokenCharIndex };
}

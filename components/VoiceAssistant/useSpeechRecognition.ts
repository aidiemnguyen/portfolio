"use client";

import { parseLocalVoiceCommand } from "@/lib/voice-commands";
import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionInstance = InstanceType<typeof window.SpeechRecognition>;

function getSpeechRecognitionCtor(): typeof window.SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

/** Pause after the user spoke — auto-send without tapping stop. */
const PAUSE_AFTER_SPEECH_MS = 1800;
/** Close/stop commands — commit quickly so the overlay does not need a second utterance. */
const PAUSE_AFTER_CLOSE_MS = 450;
/** Still waiting for first words — close overlay if nothing said. */
const INITIAL_SILENCE_MS = 9000;

export function useSpeechRecognition(
  onListeningEnd?: (transcript: string) => void,
) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(
    () => typeof window !== "undefined" && getSpeechRecognitionCtor() !== null,
  );
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef("");
  const onListeningEndRef = useRef(onListeningEnd);

  useEffect(() => {
    onListeningEndRef.current = onListeningEnd;
  }, [onListeningEnd]);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const resetSilenceTimer = useCallback(
    (onSilence: () => void) => {
      clearSilenceTimer();
      const said = transcriptRef.current.trim();
      const delay = said
        ? parseLocalVoiceCommand(said)?.type === "close"
          ? PAUSE_AFTER_CLOSE_MS
          : PAUSE_AFTER_SPEECH_MS
        : INITIAL_SILENCE_MS;
      silenceTimerRef.current = setTimeout(onSilence, delay);
    },
    [clearSilenceTimer],
  );

  const stopListening = useCallback((notifyEnd = true) => {
    clearSilenceTimer();
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onend = () => {
        setIsListening(false);
        clearSilenceTimer();
        recognitionRef.current = null;
        if (notifyEnd) {
          onListeningEndRef.current?.(transcriptRef.current);
        }
      };
      try {
        recognition.stop();
      } catch {
        recognitionRef.current = null;
        setIsListening(false);
      }
      return;
    }
    setIsListening(false);
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      stopListening(false);
    }

    setError(null);
    setTranscript("");
    transcriptRef.current = "";

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      const next = combined.trim();
      transcriptRef.current = next;
      setTranscript(next);

      resetSilenceTimer(() => {
        stopListening();
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Microphone permission denied.");
      } else if (event.error !== "aborted") {
        setError(event.error);
      }
      stopListening();
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
      resetSilenceTimer(() => stopListening());
    } catch {
      setError("Could not start listening.");
      setIsListening(false);
    }
  }, [resetSilenceTimer, stopListening]);

  useEffect(() => {
    return () => {
      clearSilenceTimer();
      recognitionRef.current?.abort();
    };
  }, [clearSilenceTimer]);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    error,
    setTranscript,
  };
}

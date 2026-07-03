"use client";

import type { FullPageSectionId } from "@/lib/section-scroll";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type VoiceSectionPhase = "thinking" | "responding";

type VoiceResponseState = {
  sectionId: FullPageSectionId | null;
  activePageSection: FullPageSectionId | null;
  text: string;
  phase: VoiceSectionPhase | null;
  typingKey: number;
  isSpeaking: boolean;
  spokenCharIndex: number;
};

type VoiceResponseContextValue = VoiceResponseState & {
  activateSection: (sectionId: FullPageSectionId) => void;
  setActivePageSection: (sectionId: FullPageSectionId) => void;
  setSectionPhase: (phase: VoiceSectionPhase) => void;
  setSectionText: (text: string) => void;
  syncSpeech: (isSpeaking: boolean, spokenCharIndex: number) => void;
  clearSectionResponse: () => void;
  isSectionReplyVisible: boolean;
};

const INITIAL: VoiceResponseState = {
  sectionId: null,
  activePageSection: null,
  text: "",
  phase: null,
  typingKey: 0,
  isSpeaking: false,
  spokenCharIndex: 0,
};

const VoiceResponseContext = createContext<VoiceResponseContextValue | null>(
  null,
);

export function VoiceResponseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VoiceResponseState>(INITIAL);

  const activateSection = useCallback((sectionId: FullPageSectionId) => {
    setState((prev) => ({
      ...prev,
      sectionId,
      phase: prev.phase ?? "thinking",
      typingKey: prev.sectionId === sectionId ? prev.typingKey : prev.typingKey + 1,
    }));
  }, []);

  const setActivePageSection = useCallback((sectionId: FullPageSectionId) => {
    setState((prev) => ({ ...prev, activePageSection: sectionId }));
  }, []);

  const setSectionPhase = useCallback((phase: VoiceSectionPhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const setSectionText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, text }));
  }, []);

  const syncSpeech = useCallback(
    (isSpeaking: boolean, spokenCharIndex: number) => {
      setState((prev) => ({ ...prev, isSpeaking, spokenCharIndex }));
    },
    [],
  );

  const clearSectionResponse = useCallback(() => {
    setState(INITIAL);
  }, []);

  const isSectionReplyVisible =
    state.sectionId !== null &&
    state.sectionId === state.activePageSection &&
    (state.phase === "thinking" ||
      (state.phase === "responding" && Boolean(state.text)));

  const value = useMemo(
    () => ({
      ...state,
      activateSection,
      setActivePageSection,
      setSectionPhase,
      setSectionText,
      syncSpeech,
      clearSectionResponse,
      isSectionReplyVisible,
    }),
    [
      state,
      activateSection,
      setActivePageSection,
      setSectionPhase,
      setSectionText,
      syncSpeech,
      clearSectionResponse,
      isSectionReplyVisible,
    ],
  );

  return (
    <VoiceResponseContext.Provider value={value}>
      {children}
    </VoiceResponseContext.Provider>
  );
}

export function useVoiceResponse() {
  const ctx = useContext(VoiceResponseContext);
  if (!ctx) {
    throw new Error("useVoiceResponse must be used within VoiceResponseProvider");
  }
  return ctx;
}

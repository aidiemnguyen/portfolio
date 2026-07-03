"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { useVoiceResponse } from "@/contexts/VoiceResponseContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { TypingText } from "./TypingText";
import { VoiceGuideAvatar } from "./VoiceGuideAvatar";
import styles from "./SectionVoiceReply.module.scss";

export function SectionVoiceReply() {
  const { dictionary } = useLocaleContext();
  const reduceMotion = usePrefersReducedMotion();
  const {
    text,
    phase,
    typingKey,
    isSpeaking,
    spokenCharIndex,
    isSectionReplyVisible,
  } = useVoiceResponse();

  const isThinking = phase === "thinking";
  const guideName = dictionary.nav.logo.replace(/\.$/, "");

  return (
    <AnimatePresence>
      {isSectionReplyVisible && (
        <motion.div
          className={styles.guide}
          role="status"
          aria-live="polite"
          aria-label={`${guideName} is responding`}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className={styles.bubble}
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.bubbleInner}>
              {isThinking ? (
                <span className={styles.thinking} aria-label="Thinking">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={styles.dot} aria-hidden />
                  ))}
                </span>
              ) : (
                <TypingText
                  key={typingKey}
                  text={text}
                  active
                  isSpeaking={isSpeaking}
                  spokenCharIndex={spokenCharIndex}
                  className={styles.responseText}
                />
              )}
            </div>
            <span className={styles.bubbleTail} aria-hidden />
          </motion.div>

          <motion.div
            className={styles.avatarWrap}
            animate={
              reduceMotion || !isSpeaking
                ? undefined
                : { y: [0, -6, 0] }
            }
            transition={
              reduceMotion || !isSpeaking
                ? undefined
                : { duration: 0.55, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <VoiceGuideAvatar speaking={isSpeaking} thinking={isThinking} />
            <span className={styles.guideName}>{guideName}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import type { Dictionary } from "@/i18n/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { VoiceMicIcon } from "./VoiceMicIcon";
import styles from "./VoiceWelcomeModal.module.scss";

interface VoiceWelcomeModalProps {
  open: boolean;
  labels: Dictionary["voice"]["welcome"];
  onTry: () => void;
  onDismiss: () => void;
}

export function VoiceWelcomeModal({
  open,
  labels,
  onTry,
  onDismiss,
}: VoiceWelcomeModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDismiss]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-welcome-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <motion.button
            type="button"
            className={styles.backdropDismiss}
            aria-label={labels.closeAria}
            onClick={onDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onDismiss}
              aria-label={labels.closeAria}
            >
              ×
            </button>

            <div className={styles.hero}>
              <div className={styles.rings} aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className={styles.ring}
                    animate={{
                      scale: [1, 1.45 + i * 0.1],
                      opacity: [0.5 - i * 0.12, 0],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.35,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
              <div className={styles.micBubble}>
                <VoiceMicIcon className={styles.micIcon} />
              </div>
            </div>

            {labels.badge ? (
              <span className={styles.badge}>{labels.badge}</span>
            ) : null}
            <h2 id="voice-welcome-title" className={styles.title}>
              {labels.title}
            </h2>
            {labels.description ? (
              <p className={styles.description}>{labels.description}</p>
            ) : null}
            {labels.highlight ? (
              <p className={styles.highlight}>{labels.highlight}</p>
            ) : null}
            {labels.hint ? <p className={styles.hint}>{labels.hint}</p> : null}
            {labels.example ? (
              <p className={styles.example}>{labels.example}</p>
            ) : null}

            <div className={styles.actions}>
              <button type="button" className={styles.tryBtn} onClick={onTry}>
                <VoiceMicIcon className={styles.tryIcon} />
                {labels.tryCta}
              </button>
              <button
                type="button"
                className={styles.skipBtn}
                onClick={onDismiss}
              >
                {labels.skipCta}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

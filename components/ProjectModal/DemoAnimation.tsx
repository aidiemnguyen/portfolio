"use client";

import type { DemoAnimationType } from "@/i18n/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./DemoAnimation.module.scss";

interface DemoAnimationProps {
  type: DemoAnimationType;
  steps: string[];
  accent: "teal" | "purple";
  variant?: "hero" | "compact";
  caption?: string;
}

export function DemoAnimation({
  type,
  steps,
  accent,
  variant = "compact",
  caption,
}: DemoAnimationProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const accentClass = accent === "teal" ? styles.accentTeal : styles.accentPurple;

  useEffect(() => {
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [steps.length]);

  const variantClass = variant === "hero" ? styles.demoHero : "";

  return (
    <div className={`${styles.demo} ${accentClass} ${variantClass}`}>
      {caption && <p className={styles.caption}>{caption}</p>}
      <div className={styles.stage}>
        {type === "video-call" && <VideoCallVisual step={stepIndex} />}
        {type === "design-system" && <DesignSystemVisual step={stepIndex} />}
        {type === "ai-stream" && <AiStreamVisual step={stepIndex} />}
        {type === "relocation" && <RelocationVisual step={stepIndex} />}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          className={styles.stepLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <span className={styles.stepNum}>{stepIndex + 1}</span>
          {steps[stepIndex]}
        </motion.p>
      </AnimatePresence>
      <div className={styles.dots}>
        {steps.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === stepIndex ? styles.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function VideoCallVisual({ step }: { step: number }) {
  return (
    <div className={styles.videoGrid}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className={styles.videoTile}
          animate={{
            opacity: step >= 1 && i < 4 ? 1 : 0.35,
            scale: step >= 2 && i === 0 ? 1.05 : 1,
          }}
          transition={{ duration: 0.4 }}
        />
      ))}
      {step >= 2 && <div className={styles.videoPulse} />}
    </div>
  );
}

function DesignSystemVisual({ step }: { step: number }) {
  const components = ["Btn", "Input", "Card", "Modal"];
  return (
    <div className={styles.storybook}>
      <div className={styles.storybookSidebar}>
        {components.map((c, i) => (
          <motion.span
            key={c}
            className={styles.storyItem}
            animate={{ opacity: step >= i ? 1 : 0.3 }}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <motion.div
        className={styles.storybookCanvas}
        animate={{ scale: step >= 1 ? 1 : 0.92, opacity: step >= 1 ? 1 : 0.5 }}
      >
        <motion.div
          className={styles.previewBlock}
          animate={{ width: step >= 2 ? "80%" : "40%" }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className={styles.previewBlockSmall}
          animate={{ opacity: step >= 3 ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
}

function AiStreamVisual({ step }: { step: number }) {
  const text =
    step === 0
      ? "User: How does streaming work?"
      : step === 1
        ? "AI: Stream"
        : step === 2
          ? "AI: ing tokens arrive one|"
          : "AI: Streaming complete ✓";

  return (
    <div className={styles.chat}>
      <div className={styles.chatBubbleUser}>
        How does streaming work?
      </div>
      <div className={styles.chatBubbleAi}>
        <motion.span
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {text.replace("AI: ", "").replace("User: ", "")}
        </motion.span>
        {step >= 1 && step < 3 && <span className={styles.cursor}>|</span>}
      </div>
    </div>
  );
}

function RelocationVisual({ step }: { step: number }) {
  return (
    <div className={styles.relocation}>
      <motion.div
        className={styles.suitcase}
        animate={{ x: step * 28, y: step % 2 === 0 ? 0 : -6 }}
        transition={{ type: "spring", stiffness: 120 }}
      />
      <motion.div
        className={styles.mapPin}
        animate={{ opacity: step >= 1 ? 1 : 0.2, scale: step >= 1 ? 1 : 0.8 }}
      />
      <motion.div
        className={styles.path}
        animate={{ scaleX: Math.min(1, step / 3) }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

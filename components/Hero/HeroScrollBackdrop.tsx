"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type RefObject } from "react";
import styles from "./HeroScrollBackdrop.module.scss";

interface HeroScrollBackdropProps {
  scrollTarget: RefObject<HTMLElement | null>;
}

const ORBITS = [
  { size: 280, duration: 22, delay: 0, variant: "purple" as const },
  { size: 340, duration: 32, delay: 1.2, variant: "teal" as const },
  { size: 400, duration: 26, delay: 0.6, variant: "purple" as const },
  { size: 460, duration: 38, delay: 2, variant: "teal" as const },
] as const;

function useScrollMotion(
  progress: MotionValue<number>,
  reduceMotion: boolean
) {
  const scale = useTransform(progress, [0, 1], reduceMotion ? [1, 1] : [1, 0.38]);
  const opacity = useTransform(
    progress,
    [0, 0.7, 1],
    reduceMotion ? [1, 1, 1] : [1, 0.2, 0]
  );
  const y = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, "-22vh"]);
  return { scale, opacity, y };
}

function TypoAura({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) return null;

  return (
    <div className={styles.aura}>
      <span className={`${styles.ring} ${styles.ringOuter}`} />
      <span className={`${styles.ring} ${styles.ringInner}`} />
      <span className={styles.ringGlow} />
      {ORBITS.map((orbit, i) => (
        <motion.span
          key={i}
          className={`${styles.orbit} ${orbit.variant === "teal" ? styles.orbitTeal : styles.orbitPurple}`}
          style={{
            width: orbit.size,
            height: orbit.size,
            marginLeft: -orbit.size / 2,
            marginTop: -orbit.size / 2,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: orbit.duration,
            repeat: Infinity,
            ease: "linear",
            delay: orbit.delay,
          }}
        >
          <span className={styles.orbitDot} />
        </motion.span>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={`spark-${i}`}
          className={styles.spark}
          style={{
            left: `${20 + i * 18}%`,
            top: `${15 + (i % 2) * 55}%`,
          }}
          animate={{
            opacity: [0.15, 0.55, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2.8 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export function HeroScrollBackdrop({ scrollTarget }: HeroScrollBackdropProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end start"],
  });
  const { scale, opacity, y } = useScrollMotion(scrollYProgress, reduceMotion);

  return (
    <div className={styles.backdrop} aria-hidden>
      <div className={styles.gradient} />
      <motion.div
        className={styles.glow}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.15, 1],
                opacity: [0.75, 1, 0.75],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div className={styles.grain} />
      <motion.div
        className={styles.typoWrap}
        style={{ scale, opacity, y }}
      >
        <motion.div
          className={styles.typoScene}
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 9, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <TypoAura reduceMotion={reduceMotion} />
          <div className={styles.typoBlock}>
            <span className={styles.lineFront}>Frontend</span>
            <span className={styles.rule} />
            <span className={styles.lineName}>AI Diem</span>
          </div>
        </motion.div>
      </motion.div>
      <div className={styles.contentVeil} />
    </div>
  );
}

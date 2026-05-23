"use client";

import { motion } from "framer-motion";
import styles from "./RoadAmbience.module.scss";

const GLOWS = [
  { left: "8%", top: "18%", size: 180, color: "purple", duration: 14, delay: 0 },
  { left: "72%", top: "62%", size: 220, color: "teal", duration: 18, delay: 2 },
  { left: "42%", top: "8%", size: 140, color: "purple", duration: 16, delay: 1 },
  { left: "88%", top: "22%", size: 120, color: "teal", duration: 12, delay: 0.5 },
] as const;

const SPARKS = [
  { left: "14%", top: "72%" },
  { left: "28%", top: "28%" },
  { left: "48%", top: "78%" },
  { left: "61%", top: "18%" },
  { left: "76%", top: "68%" },
  { left: "92%", top: "38%" },
  { left: "35%", top: "55%" },
  { left: "55%", top: "42%" },
] as const;

const FLOATERS = [
  { left: "22%", top: "12%", size: 6, duration: 7 },
  { left: "67%", top: "85%", size: 5, duration: 9 },
  { left: "83%", top: "12%", size: 4, duration: 8 },
] as const;

interface RoadAmbienceProps {
  reduceMotion: boolean;
}

export function RoadAmbience({ reduceMotion }: RoadAmbienceProps) {
  if (reduceMotion) return null;

  return (
    <div className={styles.ambience} aria-hidden>
      {GLOWS.map((glow, i) => (
        <motion.div
          key={`glow-${i}`}
          className={`${styles.glow} ${glow.color === "teal" ? styles.glowTeal : styles.glowPurple}`}
          style={{
            left: glow.left,
            top: glow.top,
            width: glow.size,
            height: glow.size,
          }}
          animate={{
            x: [0, i % 2 === 0 ? 18 : -14, 0],
            y: [0, i % 2 === 0 ? -12 : 16, 0],
            scale: [1, 1.08, 1],
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{
            duration: glow.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: glow.delay,
          }}
        />
      ))}

      {SPARKS.map((spark, i) => (
        <motion.span
          key={`spark-${i}`}
          className={styles.spark}
          style={{ left: spark.left, top: spark.top }}
          animate={{
            opacity: [0.12, 0.65, 0.12],
            scale: [0.7, 1.25, 0.7],
          }}
          transition={{
            duration: 2.6 + (i % 3) * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
        />
      ))}

      {FLOATERS.map((f, i) => (
        <motion.span
          key={`float-${i}`}
          className={styles.floater}
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
          }}
          animate={{
            y: [0, -14, 0],
            x: [0, i % 2 === 0 ? 8 : -8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

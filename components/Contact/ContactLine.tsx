"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion, useTransform, type MotionValue } from "framer-motion";
import styles from "./Contact.module.scss";

interface ContactLineProps {
  children: React.ReactNode;
  index: number;
  lineCount: number;
  scrollYProgress: MotionValue<number>;
}

export function ContactLine({
  children,
  index,
  lineCount,
  scrollYProgress,
}: ContactLineProps) {
  const reduceMotion = usePrefersReducedMotion();
  const start = index / lineCount;
  const end = Math.min(1, (index + 1) / lineCount);

  const opacity = useTransform(
    scrollYProgress,
    [start, start + (end - start) * 0.35],
    reduceMotion ? [1, 1] : [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [start, start + (end - start) * 0.35],
    reduceMotion ? [0, 0] : [48, 0]
  );

  return (
    <motion.div className={styles.line} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

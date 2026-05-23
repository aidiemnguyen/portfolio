"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import styles from "./SectionReveal.module.scss";

interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  dataEraIndex?: number;
  /** First screen (e.g. hero) — animate on mount, not only in view */
  immediate?: boolean;
}

export function SectionReveal({
  children,
  id,
  className,
  dataEraIndex,
  immediate = false,
}: SectionRevealProps) {
  const reduceMotion = usePrefersReducedMotion();

  const motionProps = reduceMotion
    ? {}
    : immediate
      ? {
          initial: { opacity: 0, y: 48 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {
          initial: { opacity: 0, y: 56 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.35, margin: "0px 0px -8% 0px" },
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <motion.section
      id={id}
      className={`${styles.snap} ${className ?? ""}`}
      {...(dataEraIndex !== undefined ? { "data-era-index": dataEraIndex } : {})}
      {...motionProps}
    >
      <div className={styles.inner}>{children}</div>
    </motion.section>
  );
}

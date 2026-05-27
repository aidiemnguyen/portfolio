"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import styles from "./Approach.module.scss";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

const root = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const column = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.12 },
  },
};

const line = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease },
  },
};

const lineOther = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease },
  },
};

export function Approach() {
  const { dictionary } = useLocaleContext();
  const { approach } = dictionary;
  const reduceMotion = usePrefersReducedMotion();

  const content = (
  <>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{approach.introLabel}</p>
        <h2 id="approach-title" className={styles.headline}>
          {approach.intro}
        </h2>
        <p className={styles.subintro}>{approach.subintro}</p>
      </header>

      <div className={styles.compare} role="group" aria-label={approach.title}>
        <article className={`${styles.col} ${styles.colMe}`}>
          <p className={styles.colHead}>
            <span className={styles.colSig} aria-hidden>
              +{" "}
            </span>
            {approach.meTitle}
          </p>
          <ul className={styles.list}>
            {approach.me.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.markGood} aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <div className={styles.divider} aria-hidden>
          <span className={styles.vs}>vs</span>
        </div>

        <article className={`${styles.col} ${styles.colOther}`}>
          <p className={styles.colHead}>
            <span className={styles.colSigBad} aria-hidden>
              −{" "}
            </span>
            {approach.otherTitle}
          </p>
          <ul className={styles.list}>
            {approach.other.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.markBad} aria-hidden>
                  ×
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );

  if (reduceMotion) {
    return (
      <div className={styles.shell} aria-labelledby="approach-title">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={styles.shell}
      aria-labelledby="approach-title"
      initial="hidden"
      animate="visible"
      variants={root}
    >
      <motion.header className={styles.intro} variants={fadeUp}>
        <p className={styles.eyebrow}>{approach.introLabel}</p>
        <h2 id="approach-title" className={styles.headline}>
          {approach.intro}
        </h2>
        <p className={styles.subintro}>{approach.subintro}</p>
      </motion.header>

      <div className={styles.compare} role="group" aria-label={approach.title}>
        <motion.article
          className={`${styles.col} ${styles.colMe}`}
          variants={column}
        >
          <motion.p className={styles.colHead} variants={fadeUp}>
            <span className={styles.colSig} aria-hidden>
              +{" "}
            </span>
            {approach.meTitle}
          </motion.p>
          <motion.ul className={styles.list} variants={column}>
            {approach.me.map((item) => (
              <motion.li
                key={item}
                className={styles.item}
                variants={line}
              >
                <span className={styles.markGood} aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.article>

        <motion.div
          className={styles.divider}
          aria-hidden
          variants={fadeUp}
        >
          <span className={styles.vs}>vs</span>
        </motion.div>

        <motion.article
          className={`${styles.col} ${styles.colOther}`}
          variants={column}
        >
          <motion.p className={styles.colHead} variants={fadeUp}>
            <span className={styles.colSigBad} aria-hidden>
              −{" "}
            </span>
            {approach.otherTitle}
          </motion.p>
          <motion.ul className={styles.list} variants={column}>
            {approach.other.map((item) => (
              <motion.li
                key={item}
                className={styles.item}
                variants={lineOther}
              >
                <span className={styles.markBad} aria-hidden>
                  ×
                </span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.article>
      </div>
    </motion.div>
  );
}

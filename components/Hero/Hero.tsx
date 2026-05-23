"use client";

import { HeroScrollBackdrop } from "@/components/Hero/HeroScrollBackdrop";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { motion } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.scss";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { dictionary } = useLocaleContext();
  const { hero } = dictionary;

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <HeroScrollBackdrop scrollTarget={heroRef} />
      <motion.div
        className={styles.content}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.contentInner}>
          <motion.p className={styles.role} variants={fadeUp}>
            {hero.displayName}
          </motion.p>
          <motion.div className={styles.titleContainer} variants={fadeUp}>
            <motion.figure className={styles.image} variants={fadeUp}>
              <img src="/avatar.jpg" alt="Hero Image" />
            </motion.figure>
            <motion.h1 className={styles.title} variants={fadeUp}>
              {hero.titleLine1}
              <br />
              <span className={styles.accent}>{hero.titleLine2}</span>
            </motion.h1>
          </motion.div>
          <motion.ul className={styles.meta} variants={fadeUp}>
            <li>
              <span className={styles.metaLabel}>{hero.originLabel}</span>
              <span className={styles.metaValue}>{hero.originValue}</span>
            </li>
            <li>
              <span className={styles.metaLabel}>{hero.nowLabel}</span>
              <span className={styles.metaValue}>{hero.nowValue}</span>
            </li>
            <li>
              <span className={styles.metaLabel}>{hero.focusLabel}</span>
              <span className={styles.metaValue}>{hero.focusValue}</span>
            </li>
          </motion.ul>
          <motion.p className={styles.subtitle} variants={fadeUp}>
            {hero.subtitle}
          </motion.p>
          <motion.div className={styles.actions} variants={fadeUp}>
            <a href="#timeline" className={styles.primaryBtn}>
              {hero.ctaWork}
            </a>
            <a href="/cv.pdf" className={styles.secondaryBtn} download>
              {hero.ctaCv}
            </a>
          </motion.div>
        </div>
      </motion.div>
      <motion.a
        href="#timeline"
        className={styles.scrollIndicator}
        aria-label={hero.scrollToWork}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <span className={styles.scrollText}>{hero.scrollToWork}</span>
        <motion.span
          className={styles.arrow}
          aria-hidden
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}

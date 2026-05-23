"use client";

import { Mission } from "@/components/Mission/Mission";
import { StatValue } from "@/components/AboutStrip/StatValue";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import styles from "./AboutStrip.module.scss";

const STAT_STAGGER_BASE = 0.12;
const STAT_STAGGER_STEP = 0.07;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const statContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const tagContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

export function AboutStrip() {
  const { dictionary } = useLocaleContext();
  const { about } = dictionary;
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return (
      <div className={styles.about}>
        <Mission embedded />
        <div className={styles.stats}>
          {about.stats.map((stat, index) => (
            <div key={stat.label} className={styles.stat}>
              <StatValue
                value={stat.value}
                delay={STAT_STAGGER_BASE + index * STAT_STAGGER_STEP}
                className={styles.statValue}
              />
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.skills}>
          {about.skillGroups.map((group) => (
            <section key={group.label} className={styles.skillGroup}>
              <h3 className={styles.skillCategory}>{group.label}</h3>
              <ul className={styles.tags}>
                {group.items.map((item) => (
                  <li key={item} className={styles.tag}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className={styles.bio}>{about.bio}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.about}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <Mission embedded />
      </motion.div>

      <motion.div className={styles.stats} variants={statContainer}>
        {about.stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={styles.stat}
            variants={fadeUp}
          >
            <StatValue
              value={stat.value}
              delay={STAT_STAGGER_BASE + index * STAT_STAGGER_STEP}
              className={styles.statValue}
            />
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className={styles.skills} variants={fadeUp}>
        {about.skillGroups.map((group) => (
          <section key={group.label} className={styles.skillGroup}>
            <h3 className={styles.skillCategory}>{group.label}</h3>
            <motion.ul
              className={styles.tags}
              variants={tagContainer}
              initial="hidden"
              animate="visible"
            >
              {group.items.map((item) => (
                <motion.li key={item} className={styles.tag} variants={fadeUp}>
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </section>
        ))}
      </motion.div>

      <motion.p className={styles.bio} variants={fadeUp}>
        {about.bio}
      </motion.p>
    </motion.div>
  );
}

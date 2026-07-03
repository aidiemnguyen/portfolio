"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import type { Dictionary } from "@/i18n/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollToSection } from "@/lib/section-scroll";
import {
  VOICE_PENDING_CHAPTER_KEY,
  dispatchProjectsChapter,
} from "@/lib/voice-navigation";
import { motion, type Variants } from "framer-motion";
import styles from "./Stack.module.scss";

const ease = [0.22, 1, 0.36, 1] as const;

type StackGroup = Dictionary["stack"]["groups"][number];
type StackItem = StackGroup["items"][number];

const groupsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const tierVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease,
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const tierMetaVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease } },
};

const chipsContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 460, damping: 24 },
  },
};

function navigateToProjectsChapter(chapterIndex: number) {
  sessionStorage.setItem(VOICE_PENDING_CHAPTER_KEY, String(chapterIndex));
  scrollToSection("projects");
  window.setTimeout(() => dispatchProjectsChapter(chapterIndex), 450);
  window.setTimeout(() => dispatchProjectsChapter(chapterIndex), 1000);
}

interface StackChipProps {
  item: StackItem;
  featured: boolean;
  interactive: boolean;
}

function StackChip({ item, featured, interactive }: StackChipProps) {
  const chipClass = `${styles.chip} ${featured ? styles.chipFeatured : ""}`;

  const inner = (
    <>
      <span className={styles.chipBracket} aria-hidden>
        [
      </span>
      <span className={styles.chipLabel}>{item.label}</span>
      <span className={styles.chipBracket} aria-hidden>
        ]
      </span>
      {item.eraTag ? (
        interactive ? (
          <motion.button
            type="button"
            className={styles.eraLink}
            onClick={() =>
              navigateToProjectsChapter(item.eraTag!.chapterIndex)
            }
            whileHover={{ x: 2, scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {item.eraTag.text}
          </motion.button>
        ) : (
          <button
            type="button"
            className={styles.eraLink}
            onClick={() =>
              navigateToProjectsChapter(item.eraTag!.chapterIndex)
            }
          >
            {item.eraTag.text}
          </button>
        )
      ) : null}
    </>
  );

  if (!interactive) {
    return <span className={chipClass}>{inner}</span>;
  }

  return (
    <motion.span
      className={chipClass}
      variants={chipVariants}
      whileHover={{
        y: -3,
        transition: { type: "spring", stiffness: 520, damping: 22 },
      }}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.span>
  );
}

interface StackTierProps {
  group: StackGroup;
  index: number;
  total: number;
  interactive: boolean;
}

function StackTier({ group, index, total, interactive }: StackTierProps) {
  const featured = Boolean(group.featured);
  const tierNum = String(index + 1).padStart(2, "0");

  const body = (
    <>
      <div className={styles.tierRail} aria-hidden>
        <span
          className={`${styles.tierBadge} ${featured ? styles.tierBadgeFeatured : ""}`}
        >
          {tierNum}
        </span>
        {index < total - 1 ? <span className={styles.tierSpine} /> : null}
      </div>

      <div className={styles.tierBody}>
        <h3 id={`stack-tier-${index}`} className={styles.tierLabel}>
          <span className={styles.tierComment} aria-hidden>
            {"// "}
          </span>
          {group.label}
        </h3>

        <div className={styles.chips}>
          {group.items.map((item) =>
            interactive ? (
              <StackChip
                key={item.label}
                item={item}
                featured={featured}
                interactive
              />
            ) : (
              <StackChip
                key={item.label}
                item={item}
                featured={featured}
                interactive={false}
              />
            ),
          )}
        </div>
      </div>
    </>
  );

  const tierClass = `${styles.tier} ${featured ? styles.tierFeatured : ""}`;

  if (!interactive) {
    return (
      <section className={tierClass} aria-labelledby={`stack-tier-${index}`}>
        {body}
      </section>
    );
  }

  return (
    <motion.section
      className={tierClass}
      aria-labelledby={`stack-tier-${index}`}
      variants={tierVariants}
    >
      <motion.div className={styles.tierRail} aria-hidden variants={tierMetaVariants}>
        <span
          className={`${styles.tierBadge} ${featured ? styles.tierBadgeFeatured : ""}`}
        >
          {tierNum}
        </span>
        {index < total - 1 ? <span className={styles.tierSpine} /> : null}
      </motion.div>
      <motion.div className={styles.tierBody} variants={tierMetaVariants}>
        <h3 id={`stack-tier-${index}`} className={styles.tierLabel}>
          <span className={styles.tierComment} aria-hidden>
            {"// "}
          </span>
          {group.label}
        </h3>
        <motion.div className={styles.chips} variants={chipsContainer}>
          {group.items.map((item) => (
            <StackChip
              key={item.label}
              item={item}
              featured={featured}
              interactive
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export function Stack() {
  const { dictionary } = useLocaleContext();
  const { stack } = dictionary;
  const reduceMotion = usePrefersReducedMotion();
  const interactive = !reduceMotion;

  const tierList = (
    <div className={styles.timeline}>
      {stack.groups.map((group, index) => (
        <StackTier
          key={group.label}
          group={group}
          index={index}
          total={stack.groups.length}
          interactive={interactive}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.shell}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.terminal}>
        <div className={styles.titleBar}>
          <span className={styles.traffic} aria-hidden>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </span>
          <span className={styles.manifestName}>{stack.manifestTitle}</span>
        </div>

        <div className={styles.terminalBody}>
          {interactive ? (
            <motion.header
              className={styles.intro}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease }}
            >
              <h2 className={styles.heading}>{stack.heading}</h2>
              <p className={styles.hint}>{stack.manifestHint}</p>
            </motion.header>
          ) : (
            <header className={styles.intro}>
              <h2 className={styles.heading}>{stack.heading}</h2>
              <p className={styles.hint}>{stack.manifestHint}</p>
            </header>
          )}

          {interactive ? (
            <motion.div
              className={styles.timelineWrap}
              variants={groupsContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {tierList}
            </motion.div>
          ) : (
            tierList
          )}
        </div>
      </div>
    </div>
  );
}

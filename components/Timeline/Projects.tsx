"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getFullPageScrollRoot } from "@/lib/section-scroll";
import {
  VOICE_PENDING_CHAPTER_KEY,
  VOICE_PROJECTS_CHAPTER_EVENT,
  VOICE_PROJECT_STEP_EVENT,
  type VoiceProjectsChapterDetail,
  type VoiceProjectStepDetail,
} from "@/lib/voice-navigation";
import { motion, type Variants } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ProjectSlide } from "./ProjectSlide";
import styles from "./Projects.module.scss";

const ease = [0.22, 1, 0.36, 1] as const;

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.06 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease },
  },
};

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function useProjectsVoiceNavigation(
  activeIndex: number,
  scrollToIndex: (index: number) => void,
) {
  useEffect(() => {
    const onChapter = (e: Event) => {
      const { index } = (e as CustomEvent<VoiceProjectsChapterDetail>).detail;
      if (typeof index === "number") scrollToIndex(index);
    };

    const onStep = (e: Event) => {
      const { direction } = (e as CustomEvent<VoiceProjectStepDetail>).detail;
      if (direction !== 1 && direction !== -1) return;
      scrollToIndex(activeIndex + direction);
    };

    window.addEventListener(VOICE_PROJECTS_CHAPTER_EVENT, onChapter);
    window.addEventListener(VOICE_PROJECT_STEP_EVENT, onStep);
    return () => {
      window.removeEventListener(VOICE_PROJECTS_CHAPTER_EVENT, onChapter);
      window.removeEventListener(VOICE_PROJECT_STEP_EVENT, onStep);
    };
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem(VOICE_PENDING_CHAPTER_KEY);
      if (pending === null) return;
      sessionStorage.removeItem(VOICE_PENDING_CHAPTER_KEY);
      const index = Number.parseInt(pending, 10);
      if (!Number.isNaN(index)) scrollToIndex(index);
    } catch {
      sessionStorage.removeItem(VOICE_PENDING_CHAPTER_KEY);
    }
  }, [scrollToIndex]);
}

export function Projects() {
  const mounted = useIsMounted();
  const sectionRef = useRef<HTMLElement>(null);
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;
  const reduceMotion = usePrefersReducedMotion();
  const animate = mounted && !reduceMotion;
  const [raisedIndex, setRaisedIndex] = useState(eras.length - 1);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(eras.length - 1, index));
      setRaisedIndex(clamped);
      document.documentElement.setAttribute("data-era", String(clamped));

      const root = getFullPageScrollRoot();
      const section = sectionRef.current;
      if (root && section) {
        root.scrollTo({
          top: section.offsetTop,
          behavior: "smooth",
        });
      }
    },
    [eras.length],
  );

  useProjectsVoiceNavigation(raisedIndex, scrollToIndex);

  const renderCards = (animated: boolean) =>
    eras.map((era, index) => {
      const isRaised = raisedIndex === index;
      const wrapClass = `${styles.cardWrap} ${isRaised ? styles.cardRaised : ""}`;

      const slide = (
        <ProjectSlide
          era={era}
          index={index}
          locale={locale}
          openLabel={timeline.openChapter}
          layout="grid"
        />
      );

      return (
        <div
          key={era.slug}
          id={`project-${era.slug}`}
          className={wrapClass}
          onMouseEnter={() => {
            setRaisedIndex(index);
            document.documentElement.setAttribute("data-era", String(index));
          }}
        >
          {animated ? (
            <motion.div className={styles.cardInner} variants={cardVariants}>
              {slide}
            </motion.div>
          ) : (
            <div className={styles.cardInner}>{slide}</div>
          )}
        </div>
      );
    });

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-section="projects"
      className={styles.section}
      aria-labelledby="projects-section-title"
    >
      <header className={styles.header}>
        <h2 id="projects-section-title" className={styles.title}>
          {timeline.heading}
        </h2>
        <p className={styles.sub}>{timeline.subheading}</p>
      </header>

      <div className={styles.stack}>
        {animate ? (
          <motion.div
            className={styles.list}
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-8% 0px" }}
          >
            {renderCards(true)}
          </motion.div>
        ) : (
          <div className={styles.list}>{renderCards(false)}</div>
        )}
      </div>
    </section>
  );
}

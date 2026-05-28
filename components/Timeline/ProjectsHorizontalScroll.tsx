"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { getFullPageScrollRoot } from "@/lib/section-scroll";
import {
  VOICE_PENDING_CHAPTER_KEY,
  VOICE_PROJECTS_CHAPTER_EVENT,
  VOICE_PROJECT_STEP_EVENT,
  type VoiceProjectsChapterDetail,
  type VoiceProjectStepDetail,
} from "@/lib/voice-navigation";
import type { EraTranslation } from "@/i18n/types";
import { ProjectSlide } from "./ProjectSlide";
import styles from "./ProjectsHorizontalScroll.module.scss";

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(max, index));
}

function spineLabel(era: EraTranslation) {
  const short = era.project.split("·")[0]?.trim() ?? era.project;
  return short.length > 28 ? `${short.slice(0, 26)}…` : short;
}

function ProjectsTimelineSpine({
  eras,
  activeIndex,
  heading,
  onSelect,
}: {
  eras: EraTranslation[];
  activeIndex: number;
  heading: string;
  onSelect: (index: number) => void;
}) {
  const firstYear = eras[0]?.year ?? 2020;
  const lastYear = eras[eras.length - 1]?.year ?? firstYear;

  return (
    <aside className={styles.spine} aria-label={heading}>
      <div className={styles.spineHeader}>
        <h2 className={styles.spineTitle}>{heading}</h2>
        <p className={styles.spineRange}>
          {firstYear}
          <span aria-hidden> — </span>
          {lastYear}
        </p>
      </div>

      <nav className={styles.spineNav} role="tablist" aria-label={heading}>
        <div
          className={styles.spineTrack}
          aria-hidden
          style={
            {
              "--spine-progress": `${eras.length <= 1 ? 1 : activeIndex / (eras.length - 1)}`,
            } as CSSProperties
          }
        />
        {eras.map((era, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={era.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "step" : undefined}
              className={`${styles.spineStop} ${isActive ? styles.spineStopActive : ""}`}
              onClick={() => onSelect(index)}
            >
              <span className={styles.spineDot} aria-hidden />
              <span className={styles.spineStopText}>
                <span className={styles.spineYear}>{era.year}</span>
                <span className={styles.spineLabel}>{spineLabel(era)}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function useProjectsVoiceNavigation(
  activeEra: number,
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
      scrollToIndex(activeEra + direction);
    };

    window.addEventListener(VOICE_PROJECTS_CHAPTER_EVENT, onChapter);
    window.addEventListener(VOICE_PROJECT_STEP_EVENT, onStep);
    return () => {
      window.removeEventListener(VOICE_PROJECTS_CHAPTER_EVENT, onChapter);
      window.removeEventListener(VOICE_PROJECT_STEP_EVENT, onStep);
    };
  }, [activeEra, scrollToIndex]);

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

function ProjectsScrollDriven() {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollRootRef = useRef<HTMLElement | null>(null);
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;
  const [activeEra, setActiveEra] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  const slideCount = eras.length;
  const activeEraData = eras[activeEra];

  useLayoutEffect(() => {
    scrollRootRef.current = getFullPageScrollRoot();
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: scrollRootRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const index =
      slideCount <= 1
        ? 0
        : Math.min(slideCount - 1, Math.round(progress * (slideCount - 1)));
    setActiveEra(index);
    document.documentElement.setAttribute("data-era", String(index));
  });

  const scrollerHeight = useMemo(
    () => `${slideCount * 100}dvh`,
    [slideCount],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      if (slideCount <= 1) return;

      const target = targetRef.current;
      const root = getFullPageScrollRoot();
      if (!target || !root) return;

      const next = clampIndex(index, slideCount - 1);
      const fraction = slideCount <= 1 ? 0 : next / (slideCount - 1);
      const top =
        target.offsetTop + fraction * (target.offsetHeight - root.clientHeight);

      root.scrollTo({ top, behavior: "smooth" });
    },
    [slideCount],
  );

  useProjectsVoiceNavigation(activeEra, scrollToIndex);

  return (
    <section
      ref={targetRef}
      id="projects"
      data-section="projects"
      className={styles.scroller}
      style={{ height: scrollerHeight }}
      aria-label={timeline.heading}
    >
      <div className={styles.sticky}>
        <div className={styles.timelineLayout}>
          <ProjectsTimelineSpine
            eras={eras}
            activeIndex={activeEra}
            heading={timeline.heading}
            onSelect={scrollToIndex}
          />

          <div className={styles.contentPane}>
            <p className={styles.contentSub}>{timeline.subheading}</p>

            <div className={styles.contentStage}>
              {reduceMotion ? (
                activeEraData && (
                  <ProjectSlide
                    key={activeEraData.slug}
                    era={activeEraData}
                    index={activeEra}
                    locale={locale}
                    openLabel={timeline.openChapter}
                    isActive
                    layout="timeline"
                  />
                )
              ) : (
                <AnimatePresence mode="wait">
                  {activeEraData && (
                    <motion.div
                      key={activeEraData.slug}
                      className={styles.contentReveal}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProjectSlide
                        era={activeEraData}
                        index={activeEra}
                        locale={locale}
                        openLabel={timeline.openChapter}
                        isActive
                        layout="timeline"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsFallback() {
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;

  return (
    <section
      id="projects"
      data-section="projects"
      className={styles.fallback}
      aria-label={timeline.heading}
    >
      <header className={styles.fallbackHeader}>
        <h2 className={styles.fallbackTitle}>{timeline.heading}</h2>
        <p className={styles.fallbackSub}>{timeline.subheading}</p>
      </header>
      <div className={styles.fallbackList}>
        {eras.map((era, index) => (
          <div key={era.slug} className={styles.fallbackItem}>
            <p className={styles.fallbackYear}>{era.year}</p>
            <ProjectSlide
              era={era}
              index={index}
              locale={locale}
              openLabel={timeline.openChapter}
              isActive
              layout="timeline"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProjectsHorizontalScroll() {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <ProjectsFallback />;
  }

  return <ProjectsScrollDriven />;
}

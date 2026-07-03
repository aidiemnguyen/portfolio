"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { useIsMounted } from "@/hooks/useIsMounted";
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
} from "react";
import { ProjectSlide } from "./ProjectSlide";
import styles from "./Projects.module.scss";

const MOBILE_MQ = "(max-width: 768px)";
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
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
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollSyncRef = useRef(false);
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;
  const reduceMotion = usePrefersReducedMotion();
  const animate = mounted && !reduceMotion;
  const [raisedIndex, setRaisedIndex] = useState(eras.length - 1);

  const scrollCarouselToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const carousel = carouselRef.current;
      if (!carousel || !window.matchMedia(MOBILE_MQ).matches) return;

      scrollSyncRef.current = true;
      carousel.scrollTo({
        left: index * carousel.clientWidth,
        behavior: reduceMotion ? "auto" : behavior,
      });
      window.setTimeout(() => {
        scrollSyncRef.current = false;
      }, reduceMotion ? 0 : 400);
    },
    [reduceMotion],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(eras.length - 1, index));
      setRaisedIndex(clamped);
      document.documentElement.setAttribute("data-era", String(clamped));
      scrollCarouselToIndex(clamped);

      const root = getFullPageScrollRoot();
      const section = sectionRef.current;
      if (root && section) {
        root.scrollTo({
          top: section.offsetTop,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      }
    },
    [eras.length, reduceMotion, scrollCarouselToIndex],
  );

  useProjectsVoiceNavigation(raisedIndex, scrollToIndex);

  useEffect(() => {
    if (!mounted) return;
    scrollCarouselToIndex(eras.length - 1, "auto");
  }, [mounted, eras.length, scrollCarouselToIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const onScroll = () => {
      if (scrollSyncRef.current || !window.matchMedia(MOBILE_MQ).matches) return;

      const slideWidth = carousel.clientWidth;
      if (!slideWidth) return;

      const index = Math.round(carousel.scrollLeft / slideWidth);
      const clamped = Math.max(0, Math.min(eras.length - 1, index));

      setRaisedIndex((prev) => {
        if (prev === clamped) return prev;
        document.documentElement.setAttribute("data-era", String(clamped));
        return clamped;
      });
    };

    carousel.addEventListener("scroll", onScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", onScroll);
  }, [eras.length]);

  const renderCards = (animated: boolean) =>
    eras.map((era, index) => {
      const isRaised = raisedIndex === index;
      const wrapClass = `${styles.cardWrap} ${isRaised ? styles.cardRaised : ""}`;

      const slide = (
        <ProjectSlide
          era={era}
          locale={locale}
          openLabel={timeline.openChapter}
        />
      );

      return (
        <div
          key={era.slug}
          id={`project-${era.slug}`}
          data-slide-index={index}
          className={wrapClass}
          onMouseEnter={() => {
            if (isMobile) return;
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

  const listContent = renderCards(animate);
  const listClass = styles.list;

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-section="projects"
      className={styles.section}
      aria-labelledby="projects-section-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="projects-section-title" className={styles.title}>
            {timeline.heading}
          </h2>
          <p className={styles.sub}>{timeline.subheading}</p>
        </header>

        <div className={styles.stack}>
          <div
            ref={carouselRef}
            className={styles.carousel}
            aria-roledescription="carousel"
            aria-label={timeline.heading}
          >
            {animate ? (
              <motion.div
                className={listClass}
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-8% 0px" }}
              >
                {listContent}
              </motion.div>
            ) : (
              <div className={listClass}>{listContent}</div>
            )}
          </div>

          <div
            className={styles.pagination}
            role="tablist"
            aria-label={timeline.heading}
          >
            {eras.map((era, index) => (
              <button
                key={era.slug}
                type="button"
                role="tab"
                className={styles.dot}
                aria-selected={raisedIndex === index}
                aria-label={era.project}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

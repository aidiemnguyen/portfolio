"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { ProjectSlide } from "./ProjectSlide";
import styles from "./ProjectsHorizontalScroll.module.scss";

interface ProjectsHorizontalScrollProps {
  layout?: "scroll" | "panel";
}

export function ProjectsHorizontalScroll({
  layout = "scroll",
}: ProjectsHorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;
  const reduceMotion = usePrefersReducedMotion();
  const [activeEra, setActiveEra] = useState(0);

  const slideCount = eras.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(slideCount - 1) * 100}%`]
  );

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
    [slideCount]
  );

  const usePanel = layout === "panel" || reduceMotion;

  if (usePanel) {
    return (
      <section
        id="timeline"
        className={layout === "panel" ? styles.panel : styles.fallback}
      >
        <header className={styles.fallbackHeader}>
          <h2 className={styles.fallbackTitle}>{timeline.heading}</h2>
          <p className={styles.fallbackSub}>{timeline.subheading}</p>
        </header>
        <div className={styles.fallbackList}>
          {eras.map((era, index) => (
            <ProjectSlide
              key={era.slug}
              era={era}
              index={index}
              locale={locale}
              openLabel={timeline.openChapter}
              isActive
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="timeline"
      className={styles.scroller}
      style={{ height: scrollerHeight }}
      aria-label={timeline.heading}
    >
      <div className={styles.sticky}>
        <header className={styles.hud}>
          <div>
            <p className={styles.hudEyebrow}>{timeline.subheading}</p>
            <h2 className={styles.hudTitle}>{timeline.heading}</h2>
          </div>
          <p className={styles.hudProgress}>
            <span className={styles.hudProgressNow}>
              {String(activeEra + 1).padStart(2, "0")}
            </span>
            <span className={styles.hudProgressSep}>/</span>
            <span>{String(slideCount).padStart(2, "0")}</span>
          </p>
        </header>
        <div className={styles.viewport}>
          <motion.div className={styles.track} style={{ x }}>
            {eras.map((era, index) => (
              <div key={era.slug} className={styles.panel}>
                <ProjectSlide
                  era={era}
                  index={index}
                  locale={locale}
                  openLabel={timeline.openChapter}
                  isActive={index === activeEra}
                />
              </div>
            ))}
          </motion.div>
        </div>
        <div className={styles.dots} aria-hidden>
          {eras.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === activeEra ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

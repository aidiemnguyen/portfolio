"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ProjectSlide } from "./ProjectSlide";
import styles from "./ProjectsHorizontalScroll.module.scss";

interface ProjectsHorizontalScrollProps {
  layout?: "scroll" | "panel" | "overlay";
}

function clampIndex(index: number, max: number) {
  return Math.max(0, Math.min(max, index));
}

/** Full-screen overlay: one gesture → one slide, smooth scrollTo. */
function ProjectsOverlayCarousel() {
  const overlayRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const animatingRef = useRef(false);
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;
  const reduceMotion = usePrefersReducedMotion();
  const [activeEra, setActiveEra] = useState(0);

  const slideCount = eras.length;

  const goTo = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      if (!scroller || slideCount <= 1) return;

      const next = clampIndex(index, slideCount - 1);
      if (next === indexRef.current) return;

      animatingRef.current = true;
      indexRef.current = next;
      setActiveEra(next);
      document.documentElement.setAttribute("data-era", String(next));

      scroller.scrollTo({
        left: next * scroller.clientWidth,
        behavior: reduceMotion ? "auto" : "smooth",
      });

      if (reduceMotion) {
        animatingRef.current = false;
      }
    },
    [reduceMotion, slideCount]
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      if (animatingRef.current) return;
      goTo(indexRef.current + direction);
    },
    [goTo]
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    const overlay = overlayRef.current;
    if (!scroller || !overlay) return;

    const onScrollEnd = () => {
      animatingRef.current = false;
      const aligned = clampIndex(
        Math.round(scroller.scrollLeft / scroller.clientWidth),
        slideCount - 1
      );
      if (aligned !== indexRef.current) {
        indexRef.current = aligned;
        setActiveEra(aligned);
        document.documentElement.setAttribute("data-era", String(aligned));
      }
    };

    const wheelDelta = (e: WheelEvent) => {
      let { deltaX, deltaY } = e;
      if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        deltaX *= 16;
        deltaY *= 16;
      } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        const page = scroller.clientWidth;
        deltaX *= page;
        deltaY *= page;
      }
      return Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (animatingRef.current) return;

      const delta = wheelDelta(e);
      if (Math.abs(delta) < 10) return;

      step(delta > 0 ? 1 : -1);
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0]?.clientX ?? 0;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (animatingRef.current) return;
      const endX = e.changedTouches[0]?.clientX ?? touchStartX;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const dx = touchStartX - endX;
      const dy = touchStartY - endY;
      const delta = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
      if (Math.abs(delta) < 56) return;
      step(delta > 0 ? 1 : -1);
    };

    overlay.addEventListener("wheel", onWheel, { passive: false, capture: true });
    overlay.addEventListener("touchstart", onTouchStart, { passive: true });
    overlay.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("scrollend", onScrollEnd);

    let scrollIdleTimer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(onScrollEnd, 150);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });

    window.addEventListener("resize", onScrollEnd);

    return () => {
      overlay.removeEventListener("wheel", onWheel, { capture: true });
      overlay.removeEventListener("touchstart", onTouchStart);
      overlay.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("scrollend", onScrollEnd);
      scroller.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollIdleTimer);
      window.removeEventListener("resize", onScrollEnd);
    };
  }, [slideCount, step]);

  return (
    <section
      ref={overlayRef}
      id="timeline"
      className={styles.overlay}
      aria-label={timeline.heading}
    >
      <header className={styles.hudOverlay}>
        <p className={styles.hudProgress}>
          <span className={styles.hudProgressNow}>
            {String(activeEra + 1).padStart(2, "0")}
          </span>
          <span className={styles.hudProgressSep}>/</span>
          <span>{String(slideCount).padStart(2, "0")}</span>
        </p>
      </header>

      <div
        ref={scrollerRef}
        className={`${styles.overlayScroller} ${reduceMotion ? styles.overlayScrollerInstant : ""}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={timeline.heading}
      >
        {eras.map((era, index) => (
          <article key={era.slug} className={styles.carouselSlide}>
            <ProjectSlide
              era={era}
              index={index}
              locale={locale}
              openLabel={timeline.openChapter}
              isActive={index === activeEra}
            />
          </article>
        ))}
      </div>

      <div
        className={styles.dotsOverlay}
        role="tablist"
        aria-label={timeline.heading}
      >
        {eras.map((era, index) => (
          <button
            key={era.slug}
            type="button"
            role="tab"
            aria-selected={index === activeEra}
            aria-label={`${era.project} (${index + 1}/${slideCount})`}
            className={`${styles.dotBtn} ${index === activeEra ? styles.dotActive : ""}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  );
}

function ProjectsScrollDriven() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;
  const [activeEra, setActiveEra] = useState(0);

  const slideCount = eras.length;

  useLayoutEffect(() => {
    setReady(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ready ? targetRef : undefined,
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

  const scrollToIndex = useCallback(
    (index: number) => {
      if (slideCount <= 1) return;

      const target = targetRef.current;
      if (!target) return;

      const fraction = index / (slideCount - 1);
      const top =
        window.scrollY +
        target.getBoundingClientRect().top +
        fraction * (target.offsetHeight - window.innerHeight);
      window.scrollTo({ top, behavior: "smooth" });
    },
    [slideCount]
  );

  return (
    <section
      ref={targetRef}
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

        <div className={styles.dots} role="tablist" aria-label={timeline.heading}>
          {eras.map((era, index) => (
            <button
              key={era.slug}
              type="button"
              role="tab"
              aria-selected={index === activeEra}
              aria-label={`${era.project} (${index + 1}/${slideCount})`}
              className={`${styles.dotBtn} ${index === activeEra ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsPanelFallback({
  layout,
}: {
  layout: "panel" | "scroll";
}) {
  const { dictionary, locale } = useLocaleContext();
  const { timeline, eras } = dictionary;

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

export function ProjectsHorizontalScroll({
  layout = "scroll",
}: ProjectsHorizontalScrollProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (layout === "overlay") {
    if (reduceMotion) {
      return <ProjectsPanelFallback layout="panel" />;
    }
    return <ProjectsOverlayCarousel />;
  }

  if (layout === "panel" || reduceMotion) {
    return <ProjectsPanelFallback layout={layout} />;
  }

  return <ProjectsScrollDriven />;
}

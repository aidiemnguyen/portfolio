"use client";

import { AboutStrip } from "@/components/AboutStrip/AboutStrip";
import { Contact } from "@/components/Contact/Contact";
import { Navbar } from "@/components/Navbar/Navbar";
import { RoadMap } from "@/components/Road/RoadMap";
import { RoadTypoBackdrop } from "@/components/Road/RoadTypoBackdrop";
import { Stack } from "@/components/Stack/Stack";
import { Projects } from "@/components/Timeline/Projects";
import type { RoadStopId } from "@/data/road-stops";
import {
  FULLPAGE_SCROLL_ROOT_ID,
  isFullPageSectionId,
  scrollToRoad,
  scrollToSection,
  type FullPageSectionId,
} from "@/lib/section-scroll";
import {
  VOICE_NAVIGATE_EVENT,
  VOICE_PENDING_CHAPTER_KEY,
  VOICE_PENDING_NAV_KEY,
  VOICE_ROAD_BACK_EVENT,
  dispatchProjectsChapter,
  type VoiceNavigateDetail,
} from "@/lib/voice-navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "./RoadExperience.module.scss";

export function RoadExperience() {
  const [activeSection, setActiveSection] = useState<FullPageSectionId>("road");

  const goToStop = useCallback((id: RoadStopId) => {
    scrollToSection(id);
  }, []);

  useEffect(() => {
    const root = document.getElementById(FULLPAGE_SCROLL_ROOT_ID);
    if (!root) return;

    const sectionEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-section]"),
    );
    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target.getAttribute("data-section");
        if (top && isFullPageSectionId(top)) {
          setActiveSection(top);
        }
      },
      { root, threshold: [0.35, 0.55, 0.72] },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (isFullPageSectionId(hash)) {
      requestAnimationFrame(() => scrollToSection(hash, "auto"));
    }
  }, []);

  useEffect(() => {
    const applyNavigate = (detail: VoiceNavigateDetail) => {
      const action = detail.action;
      if (!action || !isFullPageSectionId(action)) return;

      scrollToSection(action);

      if (detail.chapterIndex !== undefined && action === "projects") {
        const index = detail.chapterIndex;
        sessionStorage.setItem(VOICE_PENDING_CHAPTER_KEY, String(index));
        const applyChapter = () => dispatchProjectsChapter(index);
        window.setTimeout(applyChapter, 450);
        window.setTimeout(applyChapter, 1000);
      }
    };

    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent<VoiceNavigateDetail>).detail;
      if (detail?.action) applyNavigate(detail);
    };

    const onRoadBack = () => scrollToRoad();

    window.addEventListener(VOICE_NAVIGATE_EVENT, onNavigate);
    window.addEventListener(VOICE_ROAD_BACK_EVENT, onRoadBack);

    try {
      const pending = sessionStorage.getItem(VOICE_PENDING_NAV_KEY);
      if (pending) {
        sessionStorage.removeItem(VOICE_PENDING_NAV_KEY);
        const detail = JSON.parse(pending) as VoiceNavigateDetail;
        if (detail?.action) {
          requestAnimationFrame(() => applyNavigate(detail));
        }
      }
    } catch {
      sessionStorage.removeItem(VOICE_PENDING_NAV_KEY);
    }

    return () => {
      window.removeEventListener(VOICE_NAVIGATE_EVENT, onNavigate);
      window.removeEventListener(VOICE_ROAD_BACK_EVENT, onRoadBack);
    };
  }, []);

  return (
    <div className={styles.shell}>
      <main
        id={FULLPAGE_SCROLL_ROOT_ID}
        className={styles.scrollRoot}
        aria-label="Portfolio"
      >
        <section
          id="road"
          data-section="road"
          className={`${styles.section} ${styles.sectionRoad}`}
          aria-label="Road map"
        >
          <div className={styles.roadPage}>
            <Navbar
              showRoadLinks
              activeSection={activeSection}
              onScrollToSection={goToStop}
              onScrollToRoad={scrollToRoad}
            />
            <div className={styles.roadBody}>
              <RoadTypoBackdrop />
              <div className={styles.roadLayer}>
                <RoadMap onSelect={goToStop} />
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          data-section="about"
          className={`${styles.section} ${styles.sectionAbout}`}
          aria-labelledby="about-section-title"
        >
          <h2 id="about-section-title" className={styles.srOnly}>
            about
          </h2>
          <div className={styles.sectionInner}>
            <AboutStrip />
          </div>
        </section>

        <Projects />

        <section
          id="stack"
          data-section="stack"
          className={`${styles.section} ${styles.sectionStack}`}
          aria-label="stack"
        >
          <Stack />
        </section>

        <section
          id="contact"
          data-section="contact"
          className={`${styles.section} ${styles.sectionContact}`}
          aria-label="contact"
        >
          <Contact />
        </section>
      </main>
    </div>
  );
}

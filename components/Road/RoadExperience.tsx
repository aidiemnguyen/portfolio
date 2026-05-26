"use client";

import { Navbar } from "@/components/Navbar/Navbar";
import { CategoryScreen } from "@/components/Road/CategoryScreen";
import { RoadMap } from "@/components/Road/RoadMap";
import { RoadTypoBackdrop } from "@/components/Road/RoadTypoBackdrop";
import type { RoadStopId } from "@/data/road-stops";
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
  const [activeStop, setActiveStop] = useState<RoadStopId | null>(null);

  const openStop = useCallback((id: RoadStopId) => {
    setActiveStop(id);
  }, []);

  const closeStop = useCallback(() => {
    setActiveStop(null);
  }, []);

  useEffect(() => {
    if (activeStop) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [activeStop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeStop) {
        closeStop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStop, closeStop]);

  useEffect(() => {
    const applyNavigate = (detail: VoiceNavigateDetail) => {
      const stopId = detail.action as RoadStopId;
      setActiveStop(stopId);

      if (detail.chapterIndex !== undefined && stopId === "projects") {
        const index = detail.chapterIndex;
        sessionStorage.setItem(VOICE_PENDING_CHAPTER_KEY, String(index));
        const applyChapter = () => dispatchProjectsChapter(index);
        window.setTimeout(applyChapter, 500);
        window.setTimeout(applyChapter, 1100);
      }
    };

    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent<VoiceNavigateDetail>).detail;
      if (detail?.action) applyNavigate(detail);
    };

    window.addEventListener(VOICE_NAVIGATE_EVENT, onNavigate);
    window.addEventListener(VOICE_ROAD_BACK_EVENT, closeStop);

    try {
      const pending = sessionStorage.getItem(VOICE_PENDING_NAV_KEY);
      if (pending) {
        sessionStorage.removeItem(VOICE_PENDING_NAV_KEY);
        const detail = JSON.parse(pending) as VoiceNavigateDetail;
        if (detail?.action) applyNavigate(detail);
      }
    } catch {
      sessionStorage.removeItem(VOICE_PENDING_NAV_KEY);
    }

    return () => {
      window.removeEventListener(VOICE_NAVIGATE_EVENT, onNavigate);
      window.removeEventListener(VOICE_ROAD_BACK_EVENT, closeStop);
    };
  }, [closeStop]);

  return (
    <div className={styles.shell}>
      {activeStop === null && (
        <Navbar onSelectStop={openStop} showRoadLinks />
      )}
      <main id="main-content" className={styles.main}>
        {activeStop === null ? (
          <>
            <RoadTypoBackdrop />
            <div className={styles.roadLayer}>
              <RoadMap onSelect={openStop} />
            </div>
          </>
        ) : (
          <CategoryScreen stopId={activeStop} onBack={closeStop} />
        )}
      </main>
    </div>
  );
}

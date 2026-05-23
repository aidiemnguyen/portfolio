"use client";

import { Navbar } from "@/components/Navbar/Navbar";
import { CategoryScreen } from "@/components/Road/CategoryScreen";
import { RoadMap } from "@/components/Road/RoadMap";
import { RoadTypoBackdrop } from "@/components/Road/RoadTypoBackdrop";
import type { RoadStopId } from "@/data/road-stops";
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

"use client";

import { AboutStrip } from "@/components/AboutStrip/AboutStrip";
import { Approach } from "@/components/Approach/Approach";
import { Contact } from "@/components/Contact/Contact";
import { Stack } from "@/components/Stack/Stack";
import { ProjectsHorizontalScroll } from "@/components/Timeline/ProjectsHorizontalScroll";
import type { RoadStopId } from "@/data/road-stops";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./CategoryScreen.module.scss";

interface CategoryScreenProps {
  stopId: RoadStopId;
  onBack: () => void;
}

function CategoryContent({ stopId }: { stopId: RoadStopId }) {
  switch (stopId) {
    case "about":
      return <AboutStrip />;
    case "projects":
      return <ProjectsHorizontalScroll layout="overlay" />;
    case "approach":
      return <Approach />;
    case "stack":
      return <Stack />;
    case "contact":
      return <Contact layout="panel" />;
    default:
      return null;
  }
}

export function CategoryScreen({ stopId, onBack }: CategoryScreenProps) {
  const { dictionary } = useLocaleContext();
  const { road, nav } = dictionary;
  const title = nav[stopId];
  const isProjects = stopId === "projects";
  const isContact = stopId === "contact";
  const isApproach = stopId === "approach";
  const isFullBleed = isProjects || isContact || isApproach;

  return (
    <AnimatePresence>
      <motion.div
        className={`${styles.screen} ${isProjects ? styles.screenProjects : ""} ${isContact ? styles.screenContact : ""} ${isApproach ? styles.screenApproach : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {isFullBleed ? (
          <button
            type="button"
            className={styles.backFloating}
            onClick={onBack}
          >
            <span aria-hidden>←</span> {road.back}
          </button>
        ) : (
          <header className={styles.header}>
            <button type="button" className={styles.back} onClick={onBack}>
              <span aria-hidden>←</span> {road.back}
            </button>
            <p className={styles.district}>{road.stops[stopId].district}</p>
            <h2 id="category-title" className={styles.title}>
              {title}
            </h2>
          </header>
        )}
        {isFullBleed && (
          <h2 id="category-title" className={styles.srOnly}>
            {title}
          </h2>
        )}
        <div
          className={`${styles.body} ${isProjects ? styles.bodyProjects : ""} ${isContact ? styles.bodyContact : ""} ${isApproach ? styles.bodyApproach : ""}`}
        >
          <CategoryContent stopId={stopId} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

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
      return <ProjectsHorizontalScroll layout="panel" />;
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

  return (
    <AnimatePresence>
      <motion.div
        className={styles.screen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={onBack}>
            <span aria-hidden>←</span> {road.back}
          </button>
          <p className={styles.district}>{road.stops[stopId].district}</p>
          <h2 id="category-title" className={styles.title}>
            {title}
          </h2>
        </header>
        <div className={styles.body}>
          <CategoryContent stopId={stopId} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

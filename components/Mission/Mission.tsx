"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import styles from "./Mission.module.scss";

interface MissionProps {
  embedded?: boolean;
}

export function Mission({ embedded = false }: MissionProps) {
  const { dictionary } = useLocaleContext();
  const { mission } = dictionary;

  return (
    <div
      className={`${styles.mission} ${embedded ? styles.embedded : ""}`}
      aria-labelledby="mission-title"
    >
      <div className={styles.stack}>
        {mission.lines.map((line) => (
          <span key={line} className={styles.line}>
            {line}
          </span>
        ))}
        <div className={styles.highlightRow}>
          {mission.highlights.map((word) => (
            <span key={word} className={styles.highlight}>
              {word}
            </span>
          ))}
        </div>
        <span className={styles.with}>{mission.withLabel}</span>
        <div className={styles.pillRow}>
          {mission.pills.map((pill) => (
            <span key={pill} className={styles.pill}>
              {pill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

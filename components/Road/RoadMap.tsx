"use client";

import { ROAD_PATH_D, ROAD_STOPS, ROAD_VIEWBOX } from "@/data/road-stops";
import type { RoadStopId } from "@/data/road-stops";
import { RoadAmbience } from "@/components/Road/RoadAmbience";
import { RoadTraveler } from "@/components/Road/RoadTraveler";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./RoadMap.module.scss";

interface RoadMapProps {
  onSelect: (id: RoadStopId) => void;
}

export function RoadMap({ onSelect }: RoadMapProps) {
  const { dictionary, locale } = useLocaleContext();
  const { hero, road, nav } = dictionary;
  const { width: vbW, height: vbH } = ROAD_VIEWBOX;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className={styles.map}>
      <header className={styles.intro}>
        <p className={styles.role}>{hero.displayName}</p>
        <h1 className={styles.title}>
          {hero.titleLine1}{" "}
          <span className={styles.accent}>{hero.titleLine2}</span>
        </h1>
        <p className={styles.eyebrow}>{road.eyebrow}</p>
        <p className={styles.pickTitle}>{road.title}</p>
        <p className={styles.subtitle}>{road.subtitle}</p>
        <Link href={`/${locale}/resume`} className={styles.cvCta}>
          {road.viewCv}
        </Link>
      </header>

      <div className={styles.scene} role="img" aria-label={road.mapAria}>
        <RoadAmbience reduceMotion={reduceMotion} />

        <svg
          className={styles.svg}
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="roadStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#534ab7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#534ab7" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0f6e56" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {!reduceMotion && (
            <motion.path
              className={styles.pathGlow}
              d={ROAD_PATH_D}
              fill="none"
              animate={{ opacity: [0.25, 0.55, 0.25] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          <path className={styles.pathShadow} d={ROAD_PATH_D} fill="none" />
          <path className={styles.path} d={ROAD_PATH_D} fill="none" />
          <path
            className={`${styles.pathDash} ${reduceMotion ? "" : styles.pathDashAnimated}`}
            d={ROAD_PATH_D}
            fill="none"
          />
          <RoadTraveler reduceMotion={reduceMotion} />
        </svg>

        <ol className={styles.stops}>
          {ROAD_STOPS.map((stop, index) => {
            const meta = road.stops[stop.id];
            const label = nav[stop.navKey];

            return (
              <li
                key={stop.id}
                data-stop-id={stop.id}
                className={`${styles.stopItem} ${stop.lane === "above" ? styles.stopAbove : styles.stopBelow}`}
              >
                <motion.button
                  type="button"
                  className={styles.stop}
                  onClick={() => onSelect(stop.id)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.12 + index * 0.06,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className={styles.pinWrap} aria-hidden>
                    {reduceMotion ? (
                      <>
                        <span className={styles.pinRing} />
                        <span className={styles.pin} />
                      </>
                    ) : (
                      <>
                        <motion.span
                          className={styles.pinRing}
                          animate={{
                            scale: [1, 1.14, 1],
                            opacity: [0.88, 1, 0.88],
                          }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.35,
                          }}
                        />
                        <span className={styles.pin} />
                        <motion.span
                          className={styles.pinRipple}
                          animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: index * 0.35,
                          }}
                        />
                      </>
                    )}
                  </span>
                  <span className={styles.stopBody}>
                    <span className={styles.district}>{meta.district}</span>
                    <span className={styles.stopLabel}>{label}</span>
                    <span className={styles.hint}>{meta.hint}</span>
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

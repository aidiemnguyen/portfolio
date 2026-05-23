"use client";

import { ROAD_PATH_D } from "@/data/road-stops";
import { motion } from "framer-motion";
import styles from "./RoadMap.module.scss";

interface RoadTravelerProps {
  reduceMotion: boolean;
}

const pathStyle = {
  offsetPath: `path("${ROAD_PATH_D}")`,
  offsetRotate: "0deg" as const,
};

const glide = {
  offsetDistance: ["0%", "100%"],
};

const glideTransition = {
  duration: 14,
  repeat: Infinity,
  ease: "linear" as const,
};

/** Small dot gliding along the road path. */
export function RoadTraveler({ reduceMotion }: RoadTravelerProps) {
  if (reduceMotion) return null;

  return (
    <>
      <motion.circle
        className={styles.travelerGlow}
        r={11}
        style={pathStyle}
        animate={glide}
        transition={glideTransition}
      />
      <motion.circle
        className={styles.traveler}
        r={4}
        style={pathStyle}
        animate={glide}
        transition={{ ...glideTransition, delay: 0.05 }}
      />
    </>
  );
}

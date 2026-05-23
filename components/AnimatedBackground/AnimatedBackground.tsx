"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motion } from "framer-motion";
import { ChurchSpireSvg } from "./ChurchSpireSvg";
import { FolkMotifSvg } from "./FolkMotifSvg";
import { PolandMapSvg } from "./PolandMapSvg";
import { SuitcaseSvg } from "./SuitcaseSvg";
import { WroclawGnomeSvg } from "./WroclawGnomeSvg";
import styles from "./AnimatedBackground.module.scss";

type Variant = "hero" | "page" | "era";

interface AnimatedBackgroundProps {
  variant?: Variant;
}

const floatSlow = {
  y: [0, -14, 0],
  rotate: [0, 1.5, 0],
};

const floatFast = {
  y: [0, -10, 0],
  rotate: [0, -2, 0],
};

const symbolSway = {
  rotate: [0, 4, 0, -3, 0],
};

export function AnimatedBackground({ variant = "hero" }: AnimatedBackgroundProps) {
  const reduceMotion = usePrefersReducedMotion();
  const layerClass =
    variant === "page" ? styles.layerPage : styles.layer;

  const motionProps = reduceMotion
    ? {}
    : {
        animate: floatSlow,
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
      };

  const motionProps2 = reduceMotion
    ? {}
    : {
        animate: floatFast,
        transition: {
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 0.8,
        },
      };

  const symbolMotion = reduceMotion
    ? {}
    : {
        animate: symbolSway,
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
      };

  const symbolMotionDelayed = reduceMotion
    ? { animate: undefined, transition: undefined }
    : {
        animate: symbolSway,
        transition: {
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 1.2,
        },
      };

  if (variant === "era") {
    return (
      <div className={layerClass} aria-hidden>
        <motion.div
          className={`${styles.suitcase} ${styles.suitcasePurple}`}
          style={{ width: 64, right: "8%", top: "12%", opacity: 0.2 }}
          {...motionProps}
        >
          <SuitcaseSvg />
        </motion.div>
        <motion.div
          className={`${styles.symbol} ${styles.symbolGnome}`}
          style={{ right: "18%", top: "6%" }}
          {...symbolMotion}
        >
          <WroclawGnomeSvg />
        </motion.div>
        <motion.div
          className={`${styles.symbol} ${styles.symbolMap}`}
          style={{ right: "6%", top: "28%", opacity: 0.35 }}
          {...symbolMotionDelayed}
        >
          <PolandMapSvg />
        </motion.div>
      </div>
    );
  }

  const isPage = variant === "page";

  return (
    <div className={layerClass} aria-hidden>
      {!isPage && (
        <svg className={styles.route} viewBox="0 0 200 200">
          <path
            className={styles.routeLine}
            d="M20 160 Q80 40 140 80 T180 30"
          />
        </svg>
      )}

      <div className={`${styles.glow} ${styles.glowPurple}`} />
      <div className={`${styles.glow} ${styles.glowTeal}`} />

      <motion.div
        className={`${styles.suitcase} ${styles.suitcaseTeal} ${
          isPage ? styles.suitcasePage1 : styles.suitcase1
        }`}
        {...motionProps}
      >
        <SuitcaseSvg />
      </motion.div>

      <motion.div
        className={`${styles.suitcase} ${styles.suitcasePurple} ${
          isPage ? styles.suitcasePage2 : styles.suitcase2
        }`}
        {...motionProps2}
      >
        <SuitcaseSvg />
      </motion.div>

      {!isPage && (
        <>
          <motion.div
            className={`${styles.symbol} ${styles.symbolMap} ${styles.symbol1}`}
            {...symbolMotion}
          >
            <PolandMapSvg />
          </motion.div>
          <motion.div
            className={`${styles.symbol} ${styles.symbolGnome} ${styles.symbol2}`}
            {...symbolMotionDelayed}
          >
            <WroclawGnomeSvg />
          </motion.div>
          <motion.div
            className={`${styles.symbol} ${styles.symbolFolk} ${styles.symbol3}`}
            {...symbolMotion}
          >
            <FolkMotifSvg />
          </motion.div>
          <motion.div
            className={`${styles.symbol} ${styles.symbolSpire} ${styles.symbol4}`}
            {...symbolMotionDelayed}
          >
            <ChurchSpireSvg />
          </motion.div>
        </>
      )}

      {isPage && (
        <motion.div
          className={`${styles.symbol} ${styles.symbolMap} ${styles.symbolPage}`}
          {...symbolMotion}
        >
          <PolandMapSvg />
        </motion.div>
      )}
    </div>
  );
}

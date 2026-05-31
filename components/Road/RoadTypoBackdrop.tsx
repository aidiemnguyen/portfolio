"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useEffect, useState } from "react";
import styles from "./RoadTypoBackdrop.module.scss";

const LINE_FRONT = "NGUYEN THI";
const LINE_NAME = "AI DIEM";
const TYPE_MS = 78;
const PAUSE_BEFORE_ERASE_MS = 3800;

type Phase = "front" | "rule" | "name" | "hold";

function Cursor({ active }: { active: boolean }) {
  if (!active) return null;
  return <span className={styles.cursor} aria-hidden />;
}

/** Large FRONTEND / AI DIEM typography behind the road map (typing effect). */
export function RoadTypoBackdrop() {
  const reduceMotion = usePrefersReducedMotion();
  const [front, setFront] = useState(reduceMotion ? LINE_FRONT : "");
  const [name, setName] = useState(reduceMotion ? LINE_NAME : "");
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "hold" : "front");
  const [cycle, setCycle] = useState(0);
  const showRule = reduceMotion || phase !== "front";

  useEffect(() => {
    if (reduceMotion) return;

    if (phase === "front") {
      if (front.length < LINE_FRONT.length) {
        const timer = window.setTimeout(
          () => setFront(LINE_FRONT.slice(0, front.length + 1)),
          TYPE_MS,
        );
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(() => setPhase("rule"), 260);
      return () => window.clearTimeout(timer);
    }

    if (phase === "rule") {
      const timer = window.setTimeout(() => setPhase("name"), 220);
      return () => window.clearTimeout(timer);
    }

    if (phase === "name") {
      if (name.length < LINE_NAME.length) {
        const timer = window.setTimeout(
          () => setName(LINE_NAME.slice(0, name.length + 1)),
          TYPE_MS,
        );
        return () => window.clearTimeout(timer);
      }
      const timer = window.setTimeout(() => setPhase("hold"), 320);
      return () => window.clearTimeout(timer);
    }

    if (phase === "hold") {
      const timer = window.setTimeout(() => {
        setFront("");
        setName("");
        setPhase("front");
        setCycle((c) => c + 1);
      }, PAUSE_BEFORE_ERASE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [phase, front, name, reduceMotion, cycle]);

  const cursorOnFront = phase === "front";
  const cursorOnName = phase === "name" || phase === "hold";

  return (
    <div className={styles.backdrop} aria-hidden>
      <div className={styles.veil} />
      <div className={styles.typoWrap}>
        <div className={styles.typoBlock}>
          <span className={styles.lineFront}>
            {front}
            <Cursor active={!reduceMotion && cursorOnFront} />
          </span>
          {showRule && (
            <span className={`${styles.rule} ${styles.ruleStatic}`} />
          )}
          <span className={styles.lineName}>
            {name}
            <Cursor active={!reduceMotion && cursorOnName && name.length > 0} />
          </span>
        </div>
      </div>
    </div>
  );
}

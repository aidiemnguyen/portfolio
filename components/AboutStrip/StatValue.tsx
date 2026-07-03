"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useEffect, useMemo, useState } from "react";

function parseStatValue(value: string) {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
  return {
    prefix: match?.[1] ?? "",
    target: Number(match?.[2] ?? 0),
    suffix: match?.[3] ?? "",
  };
}

interface StatValueProps {
  value: string;
  /** Seconds — sync with stagger delay */
  delay?: number;
  className?: string;
}

export function StatValue({ value, delay = 0, className }: StatValueProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, target, suffix } = useMemo(
    () => parseStatValue(value),
    [value],
  );
  // SSR / static fetch: show final value; animate after mount.
  const [count, setCount] = useState(target);

  useEffect(() => {
    if (reduceMotion) {
      requestAnimationFrame(() => {
        setCount(target);
      });
      return;
    }

    const delayMs = delay * 1000;
    const durationMs = 1400;

    const delayTimer = window.setTimeout(() => {
      setCount(0);
      const start = performance.now();

      const frame = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      };

      requestAnimationFrame(frame);
    }, delayMs);

    return () => window.clearTimeout(delayTimer);
  }, [target, delay, reduceMotion]);

  const displayCount = reduceMotion ? target : count;

  return (
    <span className={className}>
      {prefix}
      {displayCount}
      {suffix}
    </span>
  );
}

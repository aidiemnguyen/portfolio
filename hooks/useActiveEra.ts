"use client";

import { useEffect, useState } from "react";

export function useActiveEra(eraCount: number): number {
  const [activeEra, setActiveEra] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-era-index]");
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const index = Number(
            visible[0].target.getAttribute("data-era-index")
          );
          if (!Number.isNaN(index)) {
            setActiveEra(index);
          }
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [eraCount]);

  return activeEra;
}

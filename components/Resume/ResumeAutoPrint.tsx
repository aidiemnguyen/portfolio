"use client";

import { useEffect } from "react";

interface ResumeAutoPrintProps {
  enabled: boolean;
}

export function ResumeAutoPrint({ enabled }: ResumeAutoPrintProps) {
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => window.print(), 450);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  return null;
}

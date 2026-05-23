"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import styles from "./Stack.module.scss";

export function Stack() {
  const { dictionary } = useLocaleContext();
  const { stack } = dictionary;

  return (
    <div className={styles.stack}>
      <h2 className={styles.heading}>{stack.heading}</h2>
      <div className={styles.grid}>
        {stack.tools.map((tool) => (
          <div key={tool.label} className={styles.item}>
            <span className={styles.icon} aria-hidden>
              {tool.symbol}
            </span>
            <span>{tool.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useLocaleContext } from "@/contexts/LocaleContext";
import styles from "./Approach.module.scss";

export function Approach() {
  const { dictionary } = useLocaleContext();
  const { approach } = dictionary;

  return (
    <div className={styles.approach} aria-labelledby="approach-title">
      <h2 id="approach-title" className={styles.title}>
        {approach.title}
      </h2>
      <div className={styles.columns}>
        <div className={`${styles.col} ${styles.colMe}`}>
          <p className={styles.colHead}>{approach.meTitle}</p>
          <ul className={styles.list}>
            {approach.me.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.markGood} aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.col} ${styles.colOther}`}>
          <p className={styles.colHead}>{approach.otherTitle}</p>
          <ul className={styles.list}>
            {approach.other.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.markBad} aria-hidden>
                  ×
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import styles from "./VoiceGuideAvatar.module.scss";

interface VoiceGuideAvatarProps {
  speaking?: boolean;
  thinking?: boolean;
}

/** Stylized bust — AI Diem as the in-page voice guide. */
export function VoiceGuideAvatar({ speaking, thinking }: VoiceGuideAvatarProps) {
  return (
    <svg
      className={styles.avatar}
      viewBox="0 0 120 132"
      role="img"
      aria-hidden
    >
      <defs>
        <linearGradient id="voiceGuideShirt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--voice-guide-shirt-top)" />
          <stop offset="100%" stopColor="var(--voice-guide-shirt-bottom)" />
        </linearGradient>
        <linearGradient id="voiceGuideHair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--voice-guide-hair-top)" />
          <stop offset="100%" stopColor="var(--voice-guide-hair-bottom)" />
        </linearGradient>
      </defs>

      <ellipse className={styles.shadow} cx="60" cy="124" rx="34" ry="6" />

      <path
        className={styles.body}
        d="M28 92 C28 78, 44 72, 60 72 C76 72, 92 78, 92 92 L96 132 L24 132 Z"
        fill="url(#voiceGuideShirt)"
      />

      <circle className={styles.neck} cx="60" cy="78" r="10" />

      <circle className={styles.head} cx="60" cy="50" r="30" />

      <path
        className={styles.hair}
        d="M32 48 C34 22, 86 22, 88 48 C88 36, 78 28, 60 28 C42 28, 32 36, 32 48 Z"
        fill="url(#voiceGuideHair)"
      />

      <path
        className={styles.bangs}
        d="M38 42 C44 34, 76 34, 82 42 C78 38, 68 36, 60 36 C52 36, 42 38, 38 42 Z"
        fill="url(#voiceGuideHair)"
      />

      <g className={styles.face}>
        <ellipse className={styles.eye} cx="48" cy="52" rx="3.5" ry="4.2" />
        <ellipse className={styles.eye} cx="72" cy="52" rx="3.5" ry="4.2" />
        <circle className={styles.eyeShine} cx="49" cy="51" r="1.2" />
        <circle className={styles.eyeShine} cx="73" cy="51" r="1.2" />

        <path
          className={styles.glasses}
          d="M38 52 H58 M62 52 H82 M58 52 C58 46, 48 46, 48 52 C48 58, 58 58, 58 52 M62 52 C62 46, 72 46, 72 52 C72 58, 62 58, 62 52 M58 52 H62"
          fill="none"
        />

        {thinking ? (
          <circle className={styles.thinkDot} cx="60" cy="66" r="2.5" />
        ) : speaking ? (
          <ellipse className={styles.mouthSpeaking} cx="60" cy="66" rx="5" ry="4" />
        ) : (
          <path
            className={styles.mouth}
            d="M54 64 Q60 69, 66 64"
            fill="none"
          />
        )}
      </g>

      <circle
        className={`${styles.cheek} ${styles.cheekLeft}`}
        cx="42"
        cy="58"
        r="5"
      />
      <circle
        className={`${styles.cheek} ${styles.cheekRight}`}
        cx="78"
        cy="58"
        r="5"
      />
    </svg>
  );
}

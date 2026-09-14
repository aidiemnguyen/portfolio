"use client";

import avatar from "@/public/avatar02.png";
import styles from "./VoiceGuideAvatar.module.scss";

interface VoiceGuideAvatarProps {
  speaking?: boolean;
  thinking?: boolean;
}

/** Stylized bust — AI Diem as the in-page voice guide. */
export function VoiceGuideAvatar({
  speaking,
  thinking,
}: VoiceGuideAvatarProps) {
  return (
    <div className={styles.avatarContainer}>
      <img
        className={styles.avatar}
        data-speaking={speaking || undefined}
        data-thinking={thinking || undefined}
        src={avatar.src}
        alt="Voice Guide Avatar"
      />
    </div>
  );
}

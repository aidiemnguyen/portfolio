import type { DemoAnimationType, EraAccent } from "@/i18n/types";
import styles from "./ProjectPreview.module.scss";

interface ProjectPreviewProps {
  type: DemoAnimationType;
  accent: EraAccent;
  label: string;
}

export function ProjectPreview({ type, accent, label }: ProjectPreviewProps) {
  const accentClass =
    accent === "teal" ? styles.previewTeal : styles.previewPurple;

  return (
    <div
      className={`${styles.preview} ${accentClass}`}
      aria-label={label}
      role="img"
    >
      {type === "video-call" && <VideoCallPreview />}
      {type === "design-system" && <DesignSystemPreview />}
      {type === "ai-stream" && <AiStreamPreview />}
    </div>
  );
}

function VideoCallPreview() {
  return (
    <div className={styles.videoGrid}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={styles.videoTile}>
          <span className={styles.avatar} />
          {i === 0 ? <span className={styles.liveBadge}>LIVE</span> : null}
        </div>
      ))}
    </div>
  );
}

function DesignSystemPreview() {
  return (
    <div className={styles.storybook}>
      <div className={styles.storySidebar}>
        <span />
        <span />
        <span className={styles.storySidebarActive} />
      </div>
      <div className={styles.storyCanvas}>
        <span className={styles.storyBtn} />
        <span className={styles.storyInput} />
        <div className={styles.storyRow}>
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function AiStreamPreview() {
  return (
    <div className={styles.chat}>
      <div className={`${styles.chatBubble} ${styles.chatUser}`}>
        <span className={styles.chatLine} style={{ width: "3.5rem" }} />
      </div>
      <div className={`${styles.chatBubble} ${styles.chatAi}`}>
        <span className={styles.chatLine} style={{ width: "5.5rem" }} />
        <span className={styles.chatLine} style={{ width: "4rem" }} />
        <span className={styles.cursor} aria-hidden />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { VoiceMicIcon } from "./VoiceMicIcon";
import styles from "./VoiceAssistant.module.css";

interface VoiceFabProps {
  onClick: () => void;
  ariaLabel: string;
}

export function VoiceFab({ onClick, ariaLabel }: VoiceFabProps) {
  return (
    <motion.button
      type="button"
      className={styles.fab}
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.94 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <VoiceMicIcon className={styles.fabIcon} strokeWidth={2} />
    </motion.button>
  );
}

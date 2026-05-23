"use client";

import { ContactLine } from "@/components/Contact/ContactLine";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScroll } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import styles from "./Contact.module.scss";

const LINE_COUNT = 4;

const CHANNEL_LINKS: Record<string, { href: string; external?: boolean }> = {
  email: { href: "mailto:aidiemnguyen2104@gmail.com" },
  linkedin: {
    href: "https://www.linkedin.com/in/thi-ai-diem-nguyen-408878194",
    external: true,
  },
  github: { href: "https://github.com/aidiemnguyen", external: true },
};

interface ContactProps {
  layout?: "scroll" | "panel";
}

export function Contact({ layout = "scroll" }: ContactProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { dictionary } = useLocaleContext();
  const { contact } = dictionary;
  const reduceMotion = usePrefersReducedMotion();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [topic, setTopic] = useState(contact.topics[0]?.id ?? "collab");
  const [channel, setChannel] = useState(contact.channels[0]?.id ?? "email");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scrollerHeight = useMemo(() => `${LINE_COUNT * 100}dvh`, []);

  const mailtoBody = useMemo(() => {
    const topicLabel =
      contact.topics.find((t) => t.id === topic)?.label ?? topic;
    return encodeURIComponent(
      `Hi AI Diem,\n\nI'm ${name || "—"} from ${country || "—"}.\nI'd like to connect about: ${topicLabel}.\n`
    );
  }, [name, country, topic, contact.topics]);

  const formContent = (
    <form
      className={styles.form}
      aria-label={contact.formAriaLabel}
      onSubmit={(e) => {
        e.preventDefault();
        const link = CHANNEL_LINKS[channel] ?? CHANNEL_LINKS.email;
        if (channel === "email") {
          window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Portfolio contact")}&body=${mailtoBody}`;
          return;
        }
        window.open(link.href, "_blank", "noopener,noreferrer");
      }}
    >
      <ContactLine
        index={0}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <p className={styles.sentence}>
          {contact.greetBefore}{" "}
          <input
            type="text"
            className={styles.input}
            placeholder={contact.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />{" "}
          {contact.greetMid}{" "}
          <input
            type="text"
            className={styles.input}
            placeholder={contact.countryPlaceholder}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country-name"
          />
        </p>
      </ContactLine>

      <ContactLine
        index={1}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <p className={styles.sentence}>
          {contact.topicBefore}{" "}
          <span className={styles.pillGroup}>
            {contact.topics.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.pill} ${topic === item.id ? styles.pillActive : ""}`}
                onClick={() => setTopic(item.id)}
                aria-pressed={topic === item.id}
              >
                {item.label}
              </button>
            ))}
          </span>
        </p>
      </ContactLine>

      <ContactLine
        index={2}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <p className={styles.sentence}>
          {contact.channelBefore}{" "}
          <span className={styles.pillGroup}>
            {contact.channels.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.pill} ${channel === item.id ? styles.pillActive : ""}`}
                onClick={() => setChannel(item.id)}
                aria-pressed={channel === item.id}
              >
                {item.label}
              </button>
            ))}
          </span>
        </p>
      </ContactLine>

      <ContactLine
        index={3}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <div className={styles.sendRow}>
          <button type="submit" className={styles.sendBtn}>
            {contact.sendLabel}
          </button>
          <p className={styles.footer}>{contact.footer}</p>
        </div>
      </ContactLine>
    </form>
  );

  if (layout === "panel" || reduceMotion) {
    return (
      <section
        id="contact"
        className={layout === "panel" ? styles.panel : styles.fallback}
      >
        <div
          className={
            layout === "panel" ? styles.panelInner : styles.stickyInner
          }
        >
          {formContent}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="contact"
      className={styles.scroller}
      style={{ height: scrollerHeight }}
    >
      <div className={styles.sticky}>
        <div className={styles.stickyInner}>{formContent}</div>
      </div>
    </section>
  );
}

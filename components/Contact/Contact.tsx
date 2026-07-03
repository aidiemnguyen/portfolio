"use client";

import { ContactLine } from "@/components/Contact/ContactLine";
import { useLocaleContext } from "@/contexts/LocaleContext";
import { useMotionValue, type MotionValue } from "framer-motion";
import { useMemo, useState } from "react";
import styles from "./Contact.module.scss";

const LINE_COUNT = 5;

const LINKEDIN_URL = "https://www.linkedin.com/in/ai-diem-nguyen-408878194";
const GITHUB_URL = "https://github.com/aidiemnguyen";

interface ContactFormProps {
  scrollYProgress: MotionValue<number>;
}

function ContactForm({ scrollYProgress }: ContactFormProps) {
  const { dictionary } = useLocaleContext();
  const { contact } = dictionary;

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [topic, setTopic] = useState(contact.topics[0]?.id ?? "collab");

  const mailtoBody = useMemo(() => {
    const topicLabel =
      contact.topics.find((t) => t.id === topic)?.label ?? topic;
    return encodeURIComponent(
      `Hi AI Diem,\n\nI'm ${name || "—"} from ${country || "—"}.\nI'd like to connect about: ${topicLabel}.\n`,
    );
  }, [name, country, topic, contact.topics]);

  return (
    <form
      className={styles.form}
      aria-label={contact.formAriaLabel}
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Portfolio contact")}&body=${mailtoBody}`;
      }}
    >
      <ContactLine
        index={0}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <p className={styles.sentence}>
          <span className={styles.prompt} aria-hidden>
            {"// "}
          </span>
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
          <span className={styles.prompt} aria-hidden>
            {"// "}
          </span>
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
        <div className={styles.emailBlock}>
          <p className={styles.sentence}>
            <span className={styles.prompt} aria-hidden>
              {"// "}
            </span>
            {contact.emailBefore}
          </p>
          <button type="submit" className={styles.sendBtn}>
            {contact.sendLabel}
          </button>
        </div>
      </ContactLine>

      <ContactLine
        index={3}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <div className={styles.socialBlock}>
          <p className={styles.sentence}>
            <span className={styles.prompt} aria-hidden>
              {"/* "}
            </span>
            {contact.socialBefore}
            <span className={styles.prompt} aria-hidden>
              {" */"}
            </span>
          </p>
          <div className={styles.socialLinks}>
            <a
              href={LINKEDIN_URL}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.linkedIn}
            </a>
            <a
              href={GITHUB_URL}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.github}
            </a>
          </div>
        </div>
      </ContactLine>

      <ContactLine
        index={4}
        lineCount={LINE_COUNT}
        scrollYProgress={scrollYProgress}
      >
        <p className={styles.footer}>{contact.footer}</p>
      </ContactLine>
    </form>
  );
}

export function Contact() {
  const scrollYProgress = useMotionValue(1);

  return (
    <div className={styles.panelInner}>
      <ContactForm scrollYProgress={scrollYProgress} />
    </div>
  );
}

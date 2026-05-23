interface PolandMapSvgProps {
  className?: string;
}

/** Simplified Poland outline — symbolic, not geographic precision */
export function PolandMapSvg({ className }: PolandMapSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M32 4 L48 8 L58 18 L62 32 L60 48 L52 62 L40 72 L28 76 L16 72 L8 58 L4 42 L6 26 L14 12 L24 6 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="38" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

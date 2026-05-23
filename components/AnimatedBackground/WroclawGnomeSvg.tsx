interface WroclawGnomeSvgProps {
  className?: string;
}

/** Wrocław krasnal — the city's iconic dwarf statues */
export function WroclawGnomeSvg({ className }: WroclawGnomeSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 4 L30 14 L28 22 L20 22 L18 14 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="21" cy="28" r="1.5" fill="currentColor" />
      <circle cx="27" cy="28" r="1.5" fill="currentColor" />
      <path
        d="M22 34 Q24 37 26 34"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M24 40 L24 52"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 46 L24 44 L32 46"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 56 L24 52 L30 56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="48"
        x2="10"
        y2="56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="34"
        y1="48"
        x2="38"
        y2="56"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ChurchSpireSvgProps {
  className?: string;
}

/** Gothic spire — Polish old-town skyline motif */
export function ChurchSpireSvg({ className }: ChurchSpireSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 4 L24 20 L20 16 L16 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line x1="20" y1="16" x2="20" y2="48" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 48 H32 V56 H8 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 56 H36 V64 H4 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="30" r="3" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M12 40 H28"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

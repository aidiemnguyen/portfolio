interface SuitcaseSvgProps {
  className?: string;
}

export function SuitcaseSvg({ className }: SuitcaseSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="8"
        y="28"
        width="64"
        height="56"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 40h64"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="30"
        y="12"
        width="20"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="40"
        y1="12"
        x2="40"
        y2="28"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="62" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="56" cy="62" r="3" fill="currentColor" opacity="0.5" />
      <line
        x1="20"
        y1="52"
        x2="60"
        y2="52"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

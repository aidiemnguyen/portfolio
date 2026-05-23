interface FolkMotifSvgProps {
  className?: string;
}

/** Lowicz / wycinanka-inspired folk rosette */
export function FolkMotifSvg({ className }: FolkMotifSvgProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="28" cy="28" r="6" stroke="currentColor" strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="28"
          cy="10"
          rx="4"
          ry="10"
          stroke="currentColor"
          strokeWidth="1.25"
          transform={`rotate(${deg} 28 28)`}
        />
      ))}
      <circle cx="28" cy="28" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

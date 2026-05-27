// Circular progress ring for the broker's composite engagement score
// (PRD §6.14 / §8.8). Pure SVG — server-renderable, no client state.

type EngagementRingProps = {
  /** 0–100. */
  score: number;
  size?: number;
};

export function EngagementRing({ score, size = 140 }: EngagementRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-line)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .6s ease" }}
      />
      <text
        x={size / 2}
        y={size / 2 + size * 0.04}
        textAnchor="middle"
        fontSize={size * 0.28}
        fontWeight={700}
        fill="var(--color-ink)"
        letterSpacing="-0.02em"
        fontFamily="var(--font-sans)"
      >
        {clamped}
      </text>
      <text
        x={size / 2}
        y={size / 2 + size * 0.22}
        textAnchor="middle"
        fontSize={size * 0.072}
        fontWeight={700}
        fill="var(--color-ink-3)"
        letterSpacing="0.13em"
        fontFamily="var(--font-sans)"
      >
        ENGAGEMENT
      </text>
    </svg>
  );
}

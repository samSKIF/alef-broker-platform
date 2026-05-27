// Linear progress bar.
//   value / total → 0..1 ratio (rendered as a percentage)
//   color  → custom fill color (defaults to brand copper)
//   height → bar thickness in pixels (default 6)
//   showCount → display "value / total" counter beneath the bar

type ProgressProps = {
  value: number;
  total: number;
  color?: string;
  height?: number;
  bgColor?: string;
  showCount?: boolean;
  className?: string;
};

export function Progress({
  value,
  total,
  color = "var(--color-accent)",
  height = 6,
  bgColor = "#EEE9E4",
  showCount = false,
  className = "",
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, total)) * 100));
  return (
    <div className={className}>
      <div
        className="overflow-hidden"
        style={{ height, background: bgColor, borderRadius: height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full transition-[width] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            background: color,
            borderRadius: height,
          }}
        />
      </div>
      {showCount && (
        <div className="mt-1.5 flex justify-between text-label font-semibold text-ink-3 tracking-wide">
          <span>{value}</span>
          <span>{total}</span>
        </div>
      )}
    </div>
  );
}

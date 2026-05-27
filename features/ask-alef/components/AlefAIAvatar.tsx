// Brand-derived mark for the Ask Alef AI surface. Per the brand guide
// (PRD §5.3), the lockup is never re-drawn at small scales, so the
// design uses a derived mark: a navy circle, a white "A", and the
// brand's copper hamza dot. An optional rotating conic-gradient aura
// signals "thinking".

type AlefAIAvatarProps = {
  size?: number;
  pulse?: boolean;
  dark?: boolean;
};

export function AlefAIAvatar({
  size = 40,
  pulse = false,
  dark = false,
}: AlefAIAvatarProps) {
  const ring = size + 8;
  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: ring, height: ring }}
    >
      {/* Rotating conic-gradient ring — the "thinking" aura */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 40%, transparent) 18%, transparent 36%, var(--color-possibilities) 54%, var(--color-accent) 72%, color-mix(in srgb, var(--color-accent) 60%, transparent) 90%, var(--color-accent) 100%)",
          animation: pulse ? "spin 4s linear infinite" : undefined,
          filter: "blur(0.4px)",
        }}
      />
      {/* Inner mask so only the ring shows around the mark. */}
      <div
        aria-hidden
        className="absolute"
        style={{
          inset: 3,
          borderRadius: (ring - 6) / 2,
          background: dark
            ? "var(--color-ink)"
            : "var(--color-bg)",
        }}
      />
      {/* The mark itself */}
      <div
        className="relative flex items-center justify-center bg-ink text-white"
        style={{
          width: size - 4,
          height: size - 4,
          borderRadius: (size - 4) / 2,
          fontSize: size * 0.5,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          fontFamily: "var(--font-sans)",
        }}
      >
        A
        {/* Copper hamza dot — the brand's signature accent */}
        <span
          aria-hidden
          className="absolute rounded-full bg-accent"
          style={{
            top: size * 0.18,
            right: size * 0.2,
            width: size * 0.13,
            height: size * 0.13,
          }}
        />
      </div>
      {/* Tiny live indicator */}
      <div
        aria-hidden
        className="absolute bottom-[1px] right-[1px] h-2.5 w-2.5 rounded-full bg-success"
        style={{
          border: `2px solid ${dark ? "var(--color-ink)" : "var(--color-bg)"}`,
        }}
      />
    </div>
  );
}

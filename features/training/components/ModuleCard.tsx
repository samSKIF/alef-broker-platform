import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/shared";
import type { Module } from "../types";

// Online-video module card from the design's Academy. Shows a small image
// tile with a play overlay (or a check / lock), tag, title, duration, and a
// "+N pts" stamp on the right.

type ModuleCardProps = {
  module: Module;
  /** Cover image (e.g. /assets/hayyan-outside.jpg) — null falls back to a tint tile. */
  coverImage?: string | null;
  done?: boolean;
  locked?: boolean;
};

export function ModuleCard({
  module,
  coverImage,
  done = false,
  locked = false,
}: ModuleCardProps) {
  const tagLabel = done
    ? "Complete"
    : locked
      ? module.tier_required ?? "Locked"
      : "New";
  const tagColor = done ? "text-success" : "text-accent";

  const body = (
    <div
      className={[
        "relative mb-3 flex items-center gap-3.5 rounded-xl border border-line bg-card p-3.5 shadow-soft-sm",
        locked ? "opacity-55" : "",
      ].join(" ")}
    >
      <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px] bg-tint">
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="72px"
            className="object-cover"
            style={{ objectPosition: "55% 60%" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-accent">
            <Icon name="academy" size={28} />
          </div>
        )}
        {!locked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink">
              {done ? (
                <Icon name="check" size={16} strokeWidth={2.4} />
              ) : (
                <Icon name="play" size={14} />
              )}
            </div>
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50 text-white">
            <Icon name="lock" size={16} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={[
            "mb-1 text-[10px] font-bold uppercase tracking-[0.13em]",
            tagColor,
          ].join(" ")}
        >
          {tagLabel}
        </div>
        <div className="mb-1 text-[14.5px] font-bold leading-[1.25] tracking-[-0.005em] text-ink">
          {module.title}
        </div>
        {module.duration && (
          <div className="text-[11.5px] text-ink-3">{module.duration}</div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div
          className={[
            "text-[16px] font-bold tracking-[-0.01em]",
            locked ? "text-ink-3" : "text-accent",
          ].join(" ")}
        >
          +{module.points}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-3">
          pts
        </div>
      </div>
    </div>
  );

  return locked ? body : <Link href={`/academy/${module.id}`}>{body}</Link>;
}

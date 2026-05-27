"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  Avatar,
  Card,
  Chip,
  Icon,
  Logo,
} from "@/components/shared";
import { logActivity } from "@/features/engagement/actions";
import type { Broker } from "@/features/brokers";
import type { Project } from "@/features/projects";

// PRD §6.10 — Branded brochure share.
// Personalised brochure preview · unit-type filter · WhatsApp/Email/More
// share row. Each share logs a brochure_shared activity row.

const FILTERS = [
  "All",
  "Studios",
  "1 BR",
  "2 BR",
  "Villas",
  "Townhouses",
] as const;

type Filter = (typeof FILTERS)[number];

type BrochureShareClientProps = {
  broker: Broker;
  project: Project;
};

export function BrochureShareClient({
  broker,
  project,
}: BrochureShareClientProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [pending, start] = useTransition();
  const [shared, setShared] = useState<string | null>(null);

  // Generate a placeholder share message — Phase 2 will host real branded PDFs.
  const shareUrl = `https://alef.example.com/projects/${project.id}`;
  const shareText = `Take a look at ${project.name} by Alef Group${
    filter !== "All" ? ` (${filter})` : ""
  }${project.tagline ? ` — ${project.tagline}` : ""}\n${shareUrl}\n\nShared by ${broker.name}${
    broker.brokerage ? ` · ${broker.brokerage}` : ""
  }`;

  function handleShare(channel: "whatsapp" | "email" | "native") {
    if (typeof window === "undefined") return;
    if (channel === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        "_blank",
      );
    } else if (channel === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(
        `${project.name} — Alef Group`,
      )}&body=${encodeURIComponent(shareText)}`;
    } else if (channel === "native" && navigator.share) {
      navigator
        .share({ title: project.name, text: shareText, url: shareUrl })
        .catch(() => {
          // user cancelled or unsupported — silent ok
        });
    }
    start(async () => {
      await logActivity({
        broker_id: broker.id,
        type: "brochure_shared",
        project_id: project.id,
        meta: { channel, filter },
      });
      setShared(channel);
    });
  }

  return (
    <>
      <div className="pb-[140px]">
        {/* Preview */}
        <div className="flex justify-center px-5 pb-4.5 pt-2">
          <BrochurePreview
            project={project}
            broker={broker}
            filter={filter}
          />
        </div>

        {/* Filter chips */}
        <div className="px-5 pb-3">
          <div className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.13em] text-ink-3">
            Tailor for your client
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Chip
                key={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </Chip>
            ))}
          </div>
        </div>

        {/* Personalisation card */}
        <div className="px-4 py-3">
          <Card pad={16}>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-3">
              Personalised with
            </div>
            <div className="flex items-center gap-3">
              <Avatar name={broker.name} size={44} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-ink">
                  {broker.name}
                </div>
                <div className="text-[12px] text-ink-3">
                  {broker.brokerage ?? "—"}
                  {broker.role ? ` · ${broker.role}` : ""}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {shared && (
          <div className="mx-4 mt-3 rounded-md bg-success/10 px-3 py-2.5 text-[12px] font-semibold text-success">
            ✓ Logged · brochure shared via {shared}
          </div>
        )}
      </div>

      {/* Share bar */}
      <div className="absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t from-bg from-70% to-transparent px-4 pb-7 pt-3.5">
        <div className="flex gap-2.5">
          <ShareBtn
            label="WhatsApp"
            iconName="whatsapp"
            tint="#25D366"
            disabled={pending}
            onClick={() => handleShare("whatsapp")}
          />
          <ShareBtn
            label="Email"
            iconName="mail"
            disabled={pending}
            onClick={() => handleShare("email")}
          />
          <ShareBtn
            label="More"
            iconName="share"
            disabled={pending}
            onClick={() => handleShare("native")}
          />
        </div>
      </div>
    </>
  );
}

function ShareBtn({
  label,
  iconName,
  tint,
  onClick,
  disabled,
}: {
  label: string;
  iconName: "whatsapp" | "mail" | "share";
  tint?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-card text-ink shadow-soft-md disabled:opacity-50"
    >
      <Icon
        name={iconName}
        size={18}
        style={{ color: tint ?? "var(--color-ink)" }}
      />
      <span className="text-[11px] font-semibold tracking-[-0.005em]">
        {label}
      </span>
    </button>
  );
}

function BrochurePreview({
  project,
  broker,
  filter,
}: {
  project: Project;
  broker: Broker;
  filter: Filter;
}) {
  const filterLabel =
    filter === "All"
      ? "Curated for your client"
      : `Filtered · ${filter}`;
  return (
    <div
      className="w-[230px] origin-center overflow-hidden rounded-[18px] bg-card"
      style={{
        boxShadow: "0 30px 60px rgba(51,63,72,0.20)",
        transform: "rotate(-1.2deg)",
      }}
    >
      {/* Hero */}
      <div className="relative h-[170px]">
        {project.cover_image && (
          <Image
            src={project.cover_image}
            alt=""
            fill
            sizes="230px"
            className="object-cover"
            style={{ objectPosition: "55% 60%" }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(20,28,34,0.25)] to-[rgba(20,28,34,0.45)]"
        />
        <div className="absolute left-3.5 top-3.5">
          <Logo height={22} dark />
        </div>
        <div className="absolute bottom-3.5 left-3.5 text-white">
          {project.tagline && (
            <div
              className="text-[9px] font-bold uppercase tracking-[0.16em] text-accent"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            >
              {/* show a short slice of the tagline as the kicker */}
              {project.tagline.split(" ").slice(0, 4).join(" ")}
            </div>
          )}
          <div
            className="text-[26px] font-bold leading-none tracking-[-0.02em]"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
          >
            {project.name}
          </div>
        </div>
      </div>

      {/* Page strip */}
      <div className="p-3.5">
        <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-3">
          {filterLabel}
        </div>
        <div className="mb-2 text-[13px] font-bold leading-[1.25] text-ink">
          {project.units ?? project.name}
        </div>
        <div className="mb-2 h-[2px] bg-line" />
        <div className="mb-2 h-[2px] w-[85%] bg-line" />
        <div className="mb-3 h-[2px] w-[70%] bg-line" />
        <div className="grid grid-cols-2 gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 rounded-sm bg-tint" />
          ))}
        </div>
      </div>

      {/* Broker footer (the personalised bit) */}
      <div className="flex items-center gap-2.5 bg-ink px-3.5 py-3 text-white">
        <Avatar name={broker.name} size={32} />
        <div className="min-w-0 flex-1">
          <div className="text-[11.5px] font-bold leading-none">
            {broker.name}
          </div>
          <div className="mt-0.5 text-[9.5px] text-white/65">
            {broker.brokerage ?? "—"}
          </div>
        </div>
        <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-accent text-white">
          <Icon name="whatsapp" size={13} />
        </div>
      </div>
    </div>
  );
}

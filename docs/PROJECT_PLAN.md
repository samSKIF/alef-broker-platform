# PROJECT_PLAN.md — Alef Broker Platform

**Last updated:** 26 May 2026 — after first build session (section 1.0)
**Updated by:** _Claude Code updates this after every step_

> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked
> Claude Code: keep the "Current status" line accurate. Tick items as you go.
> Add newly-discovered steps rather than doing hidden work.

---

## CURRENT STATUS

> _Claude Code: overwrite this line each session._

**Phase 1 · section 1.0 (project setup) is done locally; design study complete. 6 / 48 Phase-1 items done; 1 blocked (1.0.5 — GitHub remote, needs user). Next: 1.1 design-system foundation — 1.1.1 unblocked, 1.1.2 soft-blocked on the typography decision (see Blockers).**

---

## PHASE 1 — POC (the CEO demo)

Goal: a deployed, shareable two-app platform that demonstrates the full vision,
with a real database, the admin→app round-trip, and the Ask Alef AI assistant.

### 1.0 — Project setup
- [x] 1.0.1 Read all docs (CLAUDE.md, BRD.md, PRD.md) — confirm understanding
- [x] 1.0.2 Initialise Next.js (App Router, TypeScript) project
- [x] 1.0.3 Add Tailwind CSS
- [x] 1.0.4 Set up the **feature-first** repo structure per PRD §2 — create the
  `/features/*` folders and `/components/shared`
- [!] 1.0.5 Create GitHub repo, first commit, push — **first local commit done; GitHub remote pending user action (see WORKLOG)**
- [x] 1.0.6 Create `.env.example`; document required env vars
- [x] 1.0.7 Move BRD/PRD/PLAN/WORKLOG/CLAUDE into `/docs` in the repo

### 1.1 — Design system foundation
- [ ] 1.1.1 Map Alef brand palette to Tailwind theme tokens (PRD §5.1)
- [ ] 1.1.2 Configure typography — Helvetica Neue / GE SS Two / fallbacks (§5.2)
- [ ] 1.1.3 Add logo assets (light/dark) to `/public`
- [ ] 1.1.4 Build shared primitives in `/components/shared`: Button, Card, Chip, Progress, TierBadge, Icon set
- [ ] 1.1.5 Build the phone shell + the admin shell (sidebar/topbar) layouts in `/components/shared`

### 1.2 — Supabase backend
- [ ] 1.2.1 **[needs user]** Guide Samir to create the Supabase project + keys
- [ ] 1.2.2 Create all tables per PRD §8 (projects, campaigns, modules, brokers, notifications, activity)
- [ ] 1.2.3 Set up Supabase Storage buckets (project images, brochures, videos)
- [ ] 1.2.4 Write seed data (the 4 communities, modules, campaigns, sample brokers, sample activity)
- [ ] 1.2.5 Build the Supabase client + typed query helpers in `/lib/supabase`
- [ ] 1.2.6 Generate shared TypeScript types in `/types`

### 1.3 — Broker app (mobile PWA)
- [ ] 1.3.1 Splash screen (animated logo, auto-advance)
- [ ] 1.3.2 Onboarding: Welcome
- [ ] 1.3.3 Onboarding: Name capture (dummy account → brokers table)
- [ ] 1.3.4 Onboarding: Welcome message
- [ ] 1.3.5 App shell + bottom tab bar + navigation router
- [ ] 1.3.6 Home dashboard — header, greeting, snapshot, quick actions
- [ ] 1.3.7 Home — "Alef · this week" carousel (reads `campaigns`)
- [ ] 1.3.8 Academy — tier rail, pending card, segmented control, module list (reads `modules`)
- [ ] 1.3.9 Projects — list (reads `projects`)
- [ ] 1.3.10 Project detail — hero, facts, tabs, share CTA
- [ ] 1.3.11 Branded brochure share — personalisation, filter, WhatsApp/email; logs `activity`
- [ ] 1.3.12 Booking — book a visit (mocked); logs `activity`
- [ ] 1.3.13 Booking confirmation screen
- [ ] 1.3.14 In-app notification feed + bell badge (reads `notifications`)
- [ ] 1.3.15 Activity dashboard — engagement ring, breakdown, timeline (reads `activity`)

### 1.4 — Ask Alef AI assistant
- [ ] 1.4.1 **[needs user]** Guide Samir to get an OpenAI API key
- [ ] 1.4.2 Server route `/app/api/ask-alef` — OpenAI call, brochure context
- [ ] 1.4.3 Extract & store brochure text for indexed projects
- [ ] 1.4.4 Tight system prompt — restrict to Alef projects only
- [ ] 1.4.5 Ask Alef chat UI — streaming, project cards, sources
- [ ] 1.4.6 Floating "Ask Alef" button on Home → opens chat

### 1.5 — Admin console (desktop)
- [ ] 1.5.1 Admin shell — navy sidebar, topbar, routing between 6 screens
- [ ] 1.5.2 Overview / Metrics — KPIs, weekly chart, distribution, funnel, leaderboard
- [ ] 1.5.3 Brokers — roster table + drill-down panel
- [ ] 1.5.4 Projects — list + REAL authoring form → writes `projects` + Storage
- [ ] 1.5.5 Academy — list + REAL create-module form + quiz builder → writes `modules`
- [ ] 1.5.6 Campaigns — list + REAL create form + live preview → writes `campaigns`
- [ ] 1.5.7 Push notifications — REAL compose form + targeting + preview → writes `notifications`

### 1.6 — The connection (admin ↔ broker)
- [ ] 1.6.1 Publish project (admin) → appears in broker Projects + AI sources
- [ ] 1.6.2 Publish module (admin) → appears in broker Academy
- [ ] 1.6.3 Publish campaign (admin) → appears in broker Home carousel
- [ ] 1.6.4 Send notification (admin) → broker in-app feed + bell badge (Realtime)
- [ ] 1.6.5 Broker activity → rolls up into admin Overview metrics + funnel
- [ ] 1.6.6 End-to-end test of the full round-trip

### 1.7 — PWA + deploy
- [ ] 1.7.1 PWA manifest, app icons, service worker, offline shell
- [ ] 1.7.2 Connect GitHub repo to Vercel
- [ ] 1.7.3 Configure env vars on Vercel
- [ ] 1.7.4 Deploy; verify the live URL on mobile + desktop
- [ ] 1.7.5 Smoke-test the 3 "wow" moments: AI · branded brochure · engagement dashboard

### 1.8 — Demo readiness
- [ ] 1.8.1 Pre-seed the dummy broker account ("Layla Hassan") with rich activity
- [ ] 1.8.2 Final brand/QA pass against PRD §5
- [ ] 1.8.3 Confirm "demo workspace" labelling on sample data
- [ ] 1.8.4 Hand Samir a short demo script / click-path

---

## PHASE 2 — Productionization (after CEO buy-in)
> Do NOT build these during Phase 1. Listed so they are not forgotten.

- [ ] 2.1 Real broker authentication + RERA card verification
- [ ] 2.2 Real device push notifications (web-push + service worker)
- [ ] 2.3 Quiz-taking flow inside Academy modules (with scoring → points)
- [ ] 2.4 Real booking calendar (slots, availability, real reminders)
- [ ] 2.5 Embeddings / RAG pipeline for Ask Alef (beyond 3–4 projects)
- [ ] 2.6 Arabic (RTL) UI — full localisation
- [ ] 2.7 Role-based admin access + Supabase RLS hardening
- [ ] 2.8 Analytics hardening, error monitoring

## PHASE 3 — Integration & scale
- [ ] 3.1 Alef CRM integration
- [ ] 3.2 Contracts / payments
- [ ] 3.3 Data warehouse for engagement analytics
- [ ] 3.4 Native app wrappers (iOS/Android)
- [ ] 3.5 AWS migration for video hosting / scale

---

## DISCOVERED ITEMS
> Claude Code: add steps you find are needed but weren't planned. Date them.

- **[2026-05-26]** Auto-generated `AGENTS.md` from create-next-app retained at
  repo root (Next.js notice about breaking changes); pulled into our `CLAUDE.md`
  with `@AGENTS.md` so it loads automatically.
- **[2026-05-26]** `.claude/` added to `.gitignore`; per-user
  `settings.local.json` untracked.
- **[2026-05-26]** Design bundle (~21 MB tar.gz) fetched via `curl` (WebFetch
  exceeded its 10 MB limit). Extracted to `design/` and gitignored — the
  source files are available locally for inspection, the brand decisions are
  copied into `docs/PRD.md` §5 / §12 so they remain canonical in version
  control. Re-fetch URL recorded in WORKLOG.
- **[2026-05-26] NEEDS DECISION — typography.** Design bundle's `tokens.jsx`
  uses `Neue Haas Grotesk Display Pro/Text Pro` as the primary head/body
  family (with Helvetica Neue → Inter → Arial as fallbacks). PRD §5.2 says
  the brand font is *Helvetica Neue LT Pro*. The design chat transcripts
  (`design/alef/chats/chat2.md` line 423) state Neue Haas Grotesk
  "matches the brand guidelines exactly." Per the user prompt, **the brand
  guidelines PDF wins** — but we cannot read the PDF directly without
  pdftoppm. Awaiting Samir's confirmation from the PDF; until then PRD §5.2
  is unchanged.

## BLOCKERS
> Claude Code: list anything blocked and what's needed to unblock.

- **[2026-05-26] 1.0.5 — GitHub remote** — needs Samir to create the
  GitHub repository, then we push. Step-by-step in the WORKLOG.
- **[2026-05-26] Typography (PRD §5.2 vs design)** — flagged above under
  DISCOVERED ITEMS; soft-blocks 1.1.2 (typography config). Either Samir
  confirms the brand-guidelines PDF says **Neue Haas Grotesk** (then we
  update PRD §5.2), or he confirms **Helvetica Neue LT Pro** (then we
  override the design's tokens.jsx during 1.1.2).

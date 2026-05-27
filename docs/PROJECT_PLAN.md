# PROJECT_PLAN.md — Alef Broker Platform

**Last updated:** 26 May 2026 — after first build session (section 1.0)
**Updated by:** _Claude Code updates this after every step_

> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked
> Claude Code: keep the "Current status" line accurate. Tick items as you go.
> Add newly-discovered steps rather than doing hidden work.

---

## CURRENT STATUS

> _Claude Code: overwrite this line each session._

**Phase 1 · sections 1.0–1.3 done. The broker PWA is end-to-end functional: splash → welcome → onboarding (writes a new Bronze broker + cookie) → home dashboard → academy (with module detail + Mark complete) → projects list → project detail (4 tabs) → branded brochure share (WhatsApp/email + activity log) → booking (logs visit_booked + redirects to ticket) → notifications feed → activity dashboard (engagement ring + breakdown + timeline). 15 broker-app routes building cleanly under `app/(broker)`; AppHeader + TabBar in `/components/shared`; per-feature components under `features/<name>/components`. Build + lint clean. 33 / 48 Phase-1 items done. Next: section **1.4 — Ask Alef AI assistant** (1.4.1 will need the user to supply an OpenAI key).**

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
- [x] 1.0.5 Create GitHub repo, first commit, push — pushed to `https://github.com/samSKIF/alef-broker-platform` on branch `main` (renamed from `master`).
- [x] 1.0.6 Create `.env.example`; document required env vars
- [x] 1.0.7 Move BRD/PRD/PLAN/WORKLOG/CLAUDE into `/docs` in the repo

### 1.1 — Design system foundation
- [x] 1.1.1 Map Alef brand palette to Tailwind theme tokens (PRD §5.1) — `@theme` block in `app/globals.css` with brand + tier + utility colors.
- [x] 1.1.2 Configure typography — Helvetica Neue / GE SS Two / fallbacks (§5.2) — Inter / Tajawal / JetBrains_Mono loaded via `next/font`; CSS vars `--font-sans`, `--font-ar`, `--font-mono`; type scale tokens display/h1/h2/h3/body/caption/label.
- [x] 1.1.3 Add logo assets (light/dark) to `/public` — `logo-light.png` + `logo-dark.png` copied from design bundle; `Logo` component in `/components/shared` uses `next/image`.
- [x] 1.1.4 Build shared primitives in `/components/shared`: Button, Card, Chip, Progress, TierBadge, Icon set — all typed; Icon set ports the design's 31 line icons.
- [x] 1.1.5 Build the phone shell + the admin shell (sidebar/topbar) layouts in `/components/shared` — `PhoneShell` (full-screen on mobile / 390×844 device frame on desktop) and `AdminShell` (navy sidebar + topbar + content; `Link`-based nav).

### 1.2 — Supabase backend
- [x] 1.2.1 Project created via Supabase MCP under DEvsam org — `alef-broker-platform` (ref `qiowxcaofwjahlwycwbl`, eu-central-1, $10/mo). URL + publishable key in `.env.local`; service-role key pasted by Samir and validated via `/auth/v1/admin/users` returning HTTP 200.
- [x] 1.2.2 Six tables in `public` schema per PRD §8 (`projects`, `campaigns`, `modules`, `brokers`, `notifications`, `activity`) with PRD-correct types, FK constraints, and three activity indexes. One column rename: PRD §8.3's `when` → `when_at` (Postgres reserved word).
- [x] 1.2.3 Three public Storage buckets created via `storage.buckets` insert: `project-images`, `brochures`, `videos`.
- [x] 1.2.4 Seed data inserted from `design/alef/project/src/store.jsx` verbatim (snake_case rename only): 4 projects, 5 campaigns, 7 modules, 8 brokers, 1 notification, plus 442 activity rows (64 visit_booked + 282 brochure_shared + 96 module_completed) matching the per-broker counts in SEED_BROKERS exactly.
- [x] 1.2.5 Typed Supabase clients in `/lib/supabase/`: `client.ts` (browser, publishable key) and `server.ts` (service-role, `server-only` guarded). Database generic flows through so `.from('projects').select(...)` is fully typed.
- [x] 1.2.6 TypeScript types generated via MCP into `/types/database.ts`.

### 1.3 — Broker app (mobile PWA)
- [x] 1.3.1 Splash screen (animated logo, auto-advance) — `/` reads broker cookie and routes to `/welcome` or `/home` after a 3.8s animation (copper aurora, twinkles, expanding rings, logo fade-in, bilingual taglines).
- [x] 1.3.2 Onboarding: Welcome — `/welcome` hero photo + Alef logo overlay + "Get started" CTA.
- [x] 1.3.3 Onboarding: Name capture — `/onboarding/name` controlled form (Full name / Role / Brokerage) calling the `onboardBroker` server action; inserts a Bronze broker, sets the `broker_id` cookie.
- [x] 1.3.4 Onboarding: Welcome message — `/onboarding/done` "Ahlan, [name]" + Bronze enrollment + two starter actions.
- [x] 1.3.5 App shell + bottom tab bar + navigation router — `app/(broker)/(app)/layout.tsx` wraps every authenticated screen in `PhoneShell` + `<TabBar>`; new `AppHeader` and `TabBar` primitives added to `/components/shared`. Tab badges (pending Academy modules + sent-notification count) computed in the layout.
- [x] 1.3.6 Home dashboard — `/home` with greeting (date + "Good morning, X"), snapshot card (points + tier + progress to next tier via TIER ladder), 3-up quick actions (Book / Share brochure / Resume training).
- [x] 1.3.7 Home — "Alef · this week" carousel reads `campaigns` table; `CampaignCard` component in `/features/campaigns/components` handles both image-led and the special `commission` card style.
- [x] 1.3.8 Academy — `/academy` (tier rail with brand-tinted dots, pending-for-you card pointing at the next uncompleted accessible module, segmented Online/Live tabs via the `AcademyTabs` client component). Module detail at `/academy/[id]` with a `MarkCompleteButton` that writes `module_completed` activity (quiz proper deferred to Phase 2 per PRD §6.7).
- [x] 1.3.9 Projects — `/projects` (filter chips static for Phase 1, Featured card + project rows). `FeaturedProjectCard` + `ProjectRowCard` in `/features/projects/components`.
- [x] 1.3.10 Project detail — `/projects/[id]` hero photo with overlay back/share, title/location/price, facts strip, `ProjectDetailTabs` (Overview/Units/Gallery/Training — Training tab lists modules with project_id matching), "Share project brochure" CTA.
- [x] 1.3.11 Branded brochure share — `/projects/[id]/brochure` with personalised preview card (rotated brochure mock with broker name/brokerage), unit-type filter chips, and WhatsApp / Email / native-share buttons. Every share calls `logActivity({ type: 'brochure_shared', meta: { channel, filter } })`.
- [x] 1.3.12 Booking — `/booking` form (project picker, native date input, time-slot grid, reminder toggle) submits via the `submitBooking` server action which writes `visit_booked` activity and redirects.
- [x] 1.3.13 Booking confirmation — `/booking/confirmation?project=…&date=…&time=…` ticket screen with project/location/date/time and an activity log nudge.
- [x] 1.3.14 In-app notification feed — `/notifications` lists sent notifications via `NotificationRow`. Bell badge in `AppHeader` shows `countSentNotifications` from the layout.
- [x] 1.3.15 Activity dashboard — `/activity` with `EngagementRing` SVG (renders broker.engagement_score 0–100), breakdown bars (visits/shares/modules vs target ceilings), 3 stat tiles, and a recent-activity timeline that joins project + module names client-side.

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
- **[2026-05-26]** Curated subset of `design/` committed: logos to `/public`,
  brand-guidelines PDF to `/docs/assets`, and `design/alef/project/src/store.jsx`
  un-ignored so the seed data is canonical in the repo (used in 1.2.4).
- **[2026-05-26]** ESLint now ignores `design/**` — the design's JSX uses
  `<script>`-tag globals (no imports), which would otherwise trip
  `react/jsx-no-undef` 335 times.
- **[2026-05-26]** Removed create-next-app's boilerplate SVGs in `/public`
  (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — they
  were referenced only by the template `page.tsx`, which our 1.1 page rewrite
  replaced.
- **[2026-05-26] Typography decision — RESOLVED.** Samir confirmed against the
  brand-guidelines PDF: primary Latin family is **Helvetica Neue LT Pro**
  (PRD §5.2 was correct). Design `tokens.jsx`'s use of Neue Haas Grotesk
  will be overridden when we configure Tailwind typography in 1.1.2.
- **[2026-05-27] Image-path resolution — RESOLVED.** The 5 source images
  Samir placed in `/public/assets/` are referenced via a SQL `UPDATE`
  migration (`prefix_image_paths_with_assets`) that prefixes
  `projects.cover_image` and `campaigns.image` with `/assets/`. Decision
  made: store the full path in the DB rather than prefixing in code.
- **[2026-05-27] Five-file feature shape.** Features that have writes
  callable from client components (brokers, engagement, booking) now carry
  an `actions.ts` (`'use server'`) alongside `queries.ts` (`server-only`).
  Without the split the feature `index.ts` can't be a barrel for both —
  see PRD §12.
- **[2026-05-27] Client-safe feature indexes.** All feature `index.ts`
  files re-export only types + actions + UI components (no server-only
  reads). Server consumers deep-import: `@/features/<name>/queries`.
- **[2026-05-27] Cookie-based dummy account.** `broker_id` cookie set by
  `onboardBroker`; read by every authenticated page via
  `getBrokerIdFromCookie()` in `lib/dummy-account.ts`. No `httpOnly` so
  the demo can clear it from devtools to re-run onboarding.
- **[2026-05-27] Tier ladder thresholds.** `Bronze 0 / Silver 1000 /
  Gold 2500 / Preferred 5000`. Derived from the design's commission card
  and the seeded brokers' points distribution.
- **[2026-05-27] Initial-based avatars.** The seeded brokers have no
  `photo_url`; new `<Avatar>` shared primitive renders initials.
- **[2026-05-27] URL convention.** Broker app at root URLs (`/`,
  `/home`, `/projects`, …); admin will live under `/admin/*`. PRD §2's
  route groups stay as folder names (URL-invisible).

## BLOCKERS
> Claude Code: list anything blocked and what's needed to unblock.

- _(none active for 1.4)_

### Outstanding follow-ups (do NOT block 1.4)
- **[2026-05-27] RLS hardening (PROJECT_PLAN 2.7).** Phase 1's 6 public tables have Row Level Security **disabled**, so anyone with the publishable key (which ships to every broker's browser) can read AND write every row. This is intentional for the POC per PRD §11, but Supabase's advisor flagged it as critical and it MUST be addressed before any production launch.
- **[2026-05-27] Fresh-onboarded brokers see empty dashboards.** The activity dashboard, Academy tier rail and snapshot card all read from the live broker row + activity table. A demo user who walks through onboarding becomes a Bronze, 0-point broker with no activity — the dashboard looks sparse. For the CEO demo we'll want either: (a) a "Continue as Layla (demo)" affordance on `/welcome`, or (b) manually setting the `broker_id` cookie to `b1`. Decide at 1.8.1.
- **[2026-05-27] Engagement-score recompute.** The Activity dashboard reads the **stored** `engagement_score` from the brokers row. New activity doesn't change it until Phase 2 wires the live composite-score recompute (PRD §8.8).
- **[2026-05-27] Network rollups.** Admin Overview's weekly multi-series chart + activity→transaction funnel will stay as code constants for Phase 1; real aggregation over `activity` is Phase 2.
- **[2026-05-27] Quiz-taking flow.** Module detail offers a "Mark complete" button only; full quiz UI is Phase 2 per PRD §6.7.

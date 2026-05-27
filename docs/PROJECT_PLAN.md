# PROJECT_PLAN.md — Alef Broker Platform

**Last updated:** 26 May 2026 — after first build session (section 1.0)
**Updated by:** _Claude Code updates this after every step_

> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked
> Claude Code: keep the "Current status" line accurate. Tick items as you go.
> Add newly-discovered steps rather than doing hidden work.

---

## CURRENT STATUS

> _Claude Code: overwrite this line each session._

**Phase 1 · sections 1.0 + 1.1 + 1.2 done. Supabase backend live: project `alef-broker-platform` (ref `qiowxcaofwjahlwycwbl`, eu-central-1, $10/mo). All 6 PRD §8 tables created and seeded verbatim from store.jsx (4 projects, 5 campaigns, 7 modules, 8 brokers, 1 notification, 442 activity rows matching SEED_BROKERS per-broker counts). Three public storage buckets ready. Typed `@/lib/supabase/{client,server}.ts` wired against generated `/types/database.ts`. App `/` verify page now does a live DB read at request time — build + lint clean. 18 / 48 Phase-1 items done. Next: section **1.3 — Broker app (mobile PWA)**.**

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

## BLOCKERS
> Claude Code: list anything blocked and what's needed to unblock.

- _(none active for 1.3)_

### Outstanding follow-ups (do NOT block 1.3)
- **[2026-05-27] RLS hardening (PROJECT_PLAN 2.7).** Phase 1's 6 public tables have Row Level Security **disabled**, so anyone with the publishable key (which ships to every broker's browser) can read AND write every row. This is intentional for the POC per PRD §11, but Supabase's advisor flagged it as critical and it MUST be addressed before any production launch.
- **[2026-05-27] Project image uploads.** `cover_image` and `image` columns currently store bare filenames (`hayyan-panoramic.webp`, etc.) — the app code in 1.3.9 / 1.5.4 will need to either: (a) copy the asset files from `design/alef/project/assets/` into `/public/projects/`, or (b) upload them to the `project-images` Supabase Storage bucket and store full public URLs. Pick when we hit 1.3.9.

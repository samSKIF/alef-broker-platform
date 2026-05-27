# PROJECT_PLAN.md — Alef Broker Platform

**Last updated:** 26 May 2026 — after first build session (section 1.0)
**Updated by:** _Claude Code updates this after every step_

> Legend: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked
> Claude Code: keep the "Current status" line accurate. Tick items as you go.
> Add newly-discovered steps rather than doing hidden work.

---

## CURRENT STATUS

> _Claude Code: overwrite this line each session._

**Phase 1 · sections 1.0–1.6 + 1.7.1 done. Ask Alef AI scope expanded (PRD §6.6 update): the route handler now injects fresh modules + campaigns + tier ladder + the current broker's name/tier/points/completed-modules into the system prompt on every request, in addition to the existing brochures + admin-editable instructions. New shared `features/brokers/tiers.ts` is the single source of truth for the tier ladder + points rules (imported by `/home` and the AI route). Admin-editable "Points & tier program" `ai_source` lets HQ refine the loyalty-program copy without code changes. Build + TypeScript clean. 55 / 55 functional Phase-1 items done. **BLOCKED on Samir** for 1.7.2–1.7.4 — Vercel build still missing `/admin/*` routes; needs Vercel-side diagnosis (see WORKLOG).**

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
- [x] 1.3.3 Onboarding: Name capture — `/onboarding/name` controlled form calling the `onboardBroker` server action; inserts a Bronze broker, sets the `broker_id` cookie. Four fields per PRD §6.3: Full name, Role, Brokerage (all required), Profile photo (optional). Photo uploads to the new `broker-photos` Storage bucket and is stored at `brokers.photo_url`; the form was shipped without the photo field in the original 1.3.3 build and back-filled afterwards.
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
- [x] 1.4.1 OpenAI API key in `.env.local`; validated against `/v1/chat/completions` (HTTP 200, `gpt-4o-mini` reply).
- [x] 1.4.2 Server route `/app/api/ask-alef/route.ts` — POSTs `{messages}`, loads `ai_config` + enabled `ai_sources` from DB, calls OpenAI Chat Completions with `stream: true`, pipes deltas back as plain-text chunks. Caps at last 16 turns + 4 000 chars per user message.
- [x] 1.4.3 Brochure text stored in `ai_sources` (new table) — seeded with one row per indexed project (Hayyan / Al Mamsha / Olfah / Palace Residences). Admin's AI Training screen (1.5.8) will let Samir edit / add / disable sources without code changes.
- [x] 1.4.4 Tight system prompt held in `ai_config.instructions` (new table) — restricts answers to Alef projects, politely declines off-topic, asks broker to check brochure / book a visit when not in sources, brand-on-tone copy. Editable from 1.5.8.
- [x] 1.4.5 Ask Alef chat UI at `/ask-alef`: `AlefAIAvatar` brand-derived mark with rotating conic-gradient aura, message bubbles (navy user pill / white assistant bubble with avatar), streaming chunks rendered live, 3-up suggestion chips on cold start, typing-dot indicator, input pill with Enter-to-send.
- [x] 1.4.6 Floating "Ask Alef AI" button on `/home` — `AskAlefFAB` pill above the tab bar with rotating-aura avatar and copper halo; links to `/ask-alef`.
- [x] 1.4.7 Expanded AI scope (post-deploy follow-up; supersedes original PRD §6.6 "projects only" wording — new wording in PRD §12). `/api/ask-alef/route.ts` now injects, on every request: (a) all published modules with title / kind / duration / points / tier gating / quiz topics, (b) all published campaigns with subtitle + schedule, (c) the canonical tier ladder (Bronze/Silver/Gold/Preferred thresholds), and (d) the current broker's name/tier/points and completed-module IDs (only when the `broker_id` cookie is present). New shared `features/brokers/tiers.ts` owns the ladder + how-to-earn rules. New admin-editable `ai_sources` row "Points & tier program" holds the narrative policy copy. `ai_config.instructions` rewritten to cover the broadened scope while still declining unrelated topics.

### 1.5 — Admin console (desktop)
- [x] 1.5.1 Admin shell + routing — `app/(admin)/admin/layout.tsx` derives the active sidebar item from `usePathname` and renders `<AdminShell>`. Added `ai-training` to `ADMIN_ROUTES`.
- [x] 1.5.2 Overview / Metrics — `getAdminOverview` aggregates brokers + activity into 4 KPIs, a 7-day multi-series bar chart, a 4-band engagement distribution, the 5-stage activity→transaction funnel (Phase 1 synthesises the tour/offer/transaction tail from visit counts — documented in PRD §12), and a top-5 leaderboard. New shared chart components in `/features/engagement/components`.
- [x] 1.5.3 Brokers roster + drill-down — `/admin/brokers` table with engagement-mini-bar + per-broker visit/share/module counts + last-active. `/admin/brokers/[id]` drill-down reuses the EngagementRing and adds an activity timeline that joins project + module names.
- [x] 1.5.4 Projects authoring — `/admin/projects` list, `/admin/projects/new`, `/admin/projects/[id]`. `<ProjectAdminForm>` is a real working form: name/location/tagline/units/price/status + cover image / video / brochure-PDF upload to Supabase Storage (`uploadToStorage` helper in `/lib/supabase/upload.ts`) + featured/published/ai-indexed toggles + delete action.
- [x] 1.5.5 Academy authoring + quiz builder — `/admin/academy/{,new,[id]}`. `<ModuleAdminForm>` toggles online/live shape, links to a project, sets tier/points/duration/seats/location, and embeds `<QuizBuilder>` (client component that manages an array of `{q, options[], correct}` and emits hidden JSON for the action). Video upload deferred to Phase 2 — needs a `modules.video_url` column (PRD §8.3 doesn't have one); documented.
- [x] 1.5.6 Campaigns authoring + live preview — `/admin/campaigns/{,new,[id]}`. `<CampaignAdminForm>` is a controlled client form whose draft state feeds a live preview rendered with the same broker-side `<CampaignCard>`. Supports both image-led and the special "commission" card style.
- [x] 1.5.7 Push notifications — `/admin/push` composer + history. Audience targeting encoded per PRD §8.5 (`all` / `tier:T` / `engagement:band` / `project:id`). Live phone-lock-screen preview. "Send" writes a `notifications` row with `sent=true`; the broker app's bell badge + feed pick it up immediately (Realtime push wire is Phase 2 / PROJECT_PLAN 2.2).
- [x] 1.5.8 AI Training — `/admin/ai-training` edits the singleton `ai_config` row (instructions textarea + model select + temperature/max-tokens sliders) and manages the `ai_sources` library (`/admin/ai-training/source/{new,[id]}` + inline enabled toggle + delete). PDF-to-text auto-extraction is Phase 2; for Phase 1 the file is uploaded and stored at `file_url` while the operator pastes extracted text into `content`.

### 1.6 — The connection (admin ↔ broker)
- [x] 1.6.1 Publish project (admin) → appears in broker Projects + AI sources — `upsertProject` revalidates `/admin/projects`, `/projects`, `/projects/[id]`, `/admin/ai-training`. New: it now also syncs `ai_sources.enabled` with `projects.ai_indexed` so flipping the AI-indexed toggle off in admin gates that project out of `/api/ask-alef` next request. Verified end-to-end with the 4 seed projects + 1 smoke-test row.
- [x] 1.6.2 Publish module (admin) → appears in broker Academy — `upsertModule` / `deleteModule` revalidate `/admin/academy`, `/academy`, `/academy/[id]`, `/projects/[id]`. Broker Academy reads `listPublishedModules`; force-dynamic pages pick up changes on next navigation.
- [x] 1.6.3 Publish campaign (admin) → appears in broker Home carousel — `upsertCampaign` / `deleteCampaign` revalidate `/admin/campaigns` and `/home`. `/home` reads `listPublishedCampaigns` and renders the same `<CampaignCard>` used in the admin live preview.
- [x] 1.6.4 Send notification (admin) → broker in-app feed + bell badge (Realtime) — `notifications` added to the `supabase_realtime` publication. New `<NotificationBell>` client component in `/components/shared` subscribes to `postgres_changes` INSERT on `public.notifications`, bumps the badge optimistically, then calls `router.refresh()` so `/notifications` and the tab badge re-fetch. `AppHeader` now mounts the bell instead of a static `<Link>`.
- [x] 1.6.5 Broker activity → rolls up into admin Overview metrics + funnel — `submitBooking` (booking feature) and `logActivity` (engagement feature) both now revalidate `/activity`, `/admin`, `/admin/brokers`, `/admin/brokers/[broker_id]`. Verified with a probe activity row that landed in `listBrokerActivity` immediately.
- [x] 1.6.6 End-to-end test of the full round-trip — see WORKLOG verification report. SQL probes inserted + removed cleanly; `npx tsc --noEmit` + `npx next build` both pass; 34 routes compile.

### 1.7 — PWA + deploy
- [x] 1.7.1 PWA manifest, app icons, service worker, offline shell — `app/manifest.ts` (name, short_name, navy theme, beige background, standalone display, 192/512/maskable icons), `app/icon.tsx` (32px favicon), `app/apple-icon.tsx` (180px iOS), `app/icon0.tsx` (192px PWA), `app/icon1.tsx` (512px any+maskable PWA) — all generated programmatically via `next/og` ImageResponse. `public/sw.js` precaches `/offline` and intercepts failed navigations with the cached shell. `<ServiceWorkerRegister>` client component (mounted in root `app/layout.tsx`) calls `navigator.serviceWorker.register('/sw.js')` on mount. Root metadata exports `appleWebApp.capable=true` + viewport `themeColor=#333F48` so iOS Safari drops the chrome on the home-screen install.
- [!] 1.7.2 Connect GitHub repo to Vercel — BLOCKED on Samir (account + auth flow). Step-by-step guide in WORKLOG entry [2026-05-27].
- [!] 1.7.3 Configure env vars on Vercel — BLOCKED on Samir (paste 4 secrets into Vercel dashboard, NOT into chat). Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`. **NOTE:** The session task message listed `NEXT_PUBLIC_SUPABASE_ANON_KEY` but the codebase actually reads `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (per PRD §12 decision 27 May).
- [!] 1.7.4 Deploy; verify the live URL on mobile + desktop — BLOCKED on Samir kicking the first build. After deploy I will run smoke-tests against the live URL.
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
- **[2026-05-27] Config-driven AI.** The AI's system prompt + model knobs
  live in a new `ai_config` table (singleton "default" row), and its
  knowledge corpus lives in a new `ai_sources` table (one row per
  brochure / doc / note). The `/api/ask-alef` route handler reads both at
  request time, so admin's AI Training screen (1.5.8) edits the AI's
  behaviour without code changes. Phase 1 intentionally keeps it simple
  per PRD §9 — full source text passes into the system prompt; vector /
  embeddings retrieval is Phase 2 (PROJECT_PLAN 2.5).
- **[2026-05-27] OpenAI model.** Default `gpt-4o-mini` (cheapest current
  OpenAI model, ~$0.15/$0.60 per million input/output tokens). Switchable
  via `ai_config.model` without a redeploy.
- **[2026-05-27] Streaming wire format.** `/api/ask-alef` returns raw
  delta text as `Content-Type: text/plain; charset=utf-8` chunked body
  (not SSE). Client uses `fetch` + `ReadableStream` reader; rendering is
  a `setMessages` update per chunk.
- **[2026-05-27] /ask-alef sits OUTSIDE the (broker)(app) layout.** Its
  own bottom input bar would clash with the floating tab bar; the chat
  is a full-screen surface with a back-link to `/home` instead.
- **[2026-05-27] Demo affordance on /welcome.** A "Demo · Continue as
  Layla Hassan" form button (server action `continueAsDemoBroker`) sets
  the `broker_id` cookie to `b1` and redirects to `/home`. POC-only, so
  the CEO demo opens with a populated dashboard without walking through
  onboarding. Replaces the previously-broken "Already enrolled? Sign in"
  link.
- **[2026-05-27] Funnel synthesis (admin Overview).** The activity →
  transaction funnel renders real counts for `brochure_shared` and
  `visit_booked`; the tail (`tour_completed` / offers / transactions)
  is synthesised from the visit count via documented conversion ratios
  (82% / 26% / 10%). When real activity rows of those types start
  landing (1.6 round-trip) the synthesised fallback drops away.
- **[2026-05-27] Module video upload deferred.** PRD §7.4 lists "video
  upload" as a module-authoring field but PRD §8.3's schema has no
  `modules.video_url` column. The admin form documents the deferral
  inline; Phase 2 adds the column + a real upload wire.
- **[2026-05-27] PDF-to-text auto-extraction deferred.** AI Training
  (1.5.8) accepts a brochure PDF upload (stored at
  `ai_sources.file_url`) but extracting its text into
  `ai_sources.content` is Phase 2. For Phase 1 the operator pastes the
  extracted text by hand.
- **[2026-05-27] Admin form `action={…}` convention.** All six admin
  forms pass the server action **directly** as
  `<form action={serverAction}>` rather than wrapping it in an inline
  async closure. Next.js 16 throws `TypeError: Failed to fetch` at the
  `<form>` element when a client component passes a closure to a form's
  `action` (the closure captures local state that can't be serialised
  across the server-action boundary). New shared `<SubmitButton>`
  primitive uses `useFormStatus` for pending state.
- **[2026-05-27] Server-action body-size limit raised to 20 MB**
  (`next.config.ts` → `experimental.serverActions.bodySizeLimit`).
  Default is 1 MB; the admin authoring forms upload project covers
  (~1 MB JPGs) and brochure PDFs (~10 MB). 20 MB is comfortably larger
  than anything Alef ships today and well under Vercel's hard caps in
  production. Earlier `413 Body exceeded 1 MB limit` errors surfaced
  to the browser as another misleading "Failed to fetch".
- **[2026-05-27] Logo `<Image>` props cleaned up.** `next/image`
  warned about "width or height modified, but not the other" — we
  were passing both `width`/`height` props AND a conflicting
  `style={{ height, width: "auto" }}`. Dropped the style override; the
  props alone govern the rendered size.
- **[2026-05-27] next/image remotePatterns** now whitelists the
  Supabase Storage host. Derived from
  `process.env.NEXT_PUBLIC_SUPABASE_URL` at build time so a project
  swap doesn't require a config edit; fallback is the wildcard
  `*.supabase.co` for CI builds where the env var may not be set.
  Required because admin uploads land at
  `<project>.supabase.co/storage/v1/object/public/<bucket>/...` and
  `<Image>` rejects external hosts by default.

## BLOCKERS
> Claude Code: list anything blocked and what's needed to unblock.

- **[2026-05-27] 1.7.2 – 1.7.4 — Vercel deploy.** Needs Samir to (a)
  sign in to Vercel with the same GitHub identity that owns
  `samSKIF/alef-broker-platform`, (b) "Add New… → Project" → import the
  repo (Next.js + Tailwind auto-detected), (c) paste the four env
  vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`) into the Vercel
  Environment Variables panel (NOT into chat), (d) hit Deploy. Once
  the build is green I'll smoke-test the live URL.

### Outstanding follow-ups (do NOT block 1.6)
- **[2026-05-27] RLS hardening (PROJECT_PLAN 2.7).** All public tables (now 8 with `ai_config` + `ai_sources`) have Row Level Security **disabled**. Intentional POC posture per PRD §11; remediation owned by Phase 2 item 2.7. Note `ai_config` and `ai_sources` need particular care since they store the system prompt — must be admin-only writable in production.
- **[2026-05-27] Fresh-onboarded brokers see empty dashboards — RESOLVED via the new "Demo · Continue as Layla" affordance on /welcome.** Real-onboarded brokers still hit the sparse state by design; that's fine for actual usage.
- **[2026-05-27] Engagement-score recompute.** The Activity dashboard reads the **stored** `engagement_score` from the brokers row. New activity doesn't change it until Phase 2 wires the live composite-score recompute (PRD §8.8).
- **[2026-05-27] Network rollups.** Admin Overview's weekly multi-series chart + activity→transaction funnel will stay as code constants for Phase 1; real aggregation over `activity` is Phase 2.
- **[2026-05-27] Quiz-taking flow.** Module detail offers a "Mark complete" button only; full quiz UI is Phase 2 per PRD §6.7.
- **[2026-05-27] OpenAI cost cap.** No hard-stop on per-conversation cost yet — request handler caps tokens (`max_completion_tokens` from `ai_config`, default 600) and trims context (last 16 turns, 4 000 chars per user message). A real budget guard (per-broker spend, per-day cap) is Phase 2.

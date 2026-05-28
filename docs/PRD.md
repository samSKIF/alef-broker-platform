# Alef Broker Platform — Product Requirements Document (PRD)

**Document owner:** Samir Skif
**Version:** 1.0
**Last updated:** 26 May 2026
**Status:** Active — POC build

> This is the *what* and *how* of the project. Read **BRD.md** first for the
> *why*. Claude Code MUST read this document (and BRD.md and CLAUDE.md) before
> any build action, and MUST update **PROJECT_PLAN.md** and **WORKLOG.md** after
> every step. See CLAUDE.md for the standing workflow rules.

---

## 1. Product overview

The Alef Broker Platform is **two connected web apps sharing one database**:

- **Broker App** — a mobile-first PWA used by external real estate brokers.
- **Admin Console** — a desktop web app used by Alef HQ to author content and
  measure broker engagement.

The two are connected: the Admin Console **authors** the data (projects,
training modules, campaigns, notifications) that the Broker App **consumes**.
Broker activity in the app (visits booked, brochures shared, modules completed)
**rolls up** into the Admin Console's metrics.

The guiding product principle: **embed measurement into a tool brokers want to
use.** Brokers are never asked to "report" anything — their normal activity in
the app *is* the data.

---

## 2. Technology stack (DECIDED — do not change without updating this section)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router, React, TypeScript)** | One codebase; broker app + admin as route groups |
| Styling | **Tailwind CSS** | Design tokens mapped from the Alef brand (see §5) |
| PWA | **Next.js PWA** (manifest + service worker) | Installable; offline shell. Real push = Phase 2 |
| Database | **Supabase (Postgres)** | Single source of truth; tables map to the data model in §8 |
| Auth | **Hybrid — dummy account for POC.** Supabase Auth wired but not enforced | Real broker login = Phase 2 |
| File storage | **Supabase Storage** | Project images, brochure PDFs, training videos |
| AI assistant | **OpenAI API** | "Ask Alef" — grounded in indexed Alef brochures |
| Realtime | **Supabase Realtime** | Powers the admin→app live update / in-app notifications |
| Source control | **GitHub** | Claude Code commits here |
| Hosting | **Vercel** | Deploys from GitHub; provides the shareable demo URL |
| Reserved | AWS | Not used in POC; held for future scale (video, CRM) |

**Repository structure (target) — FEATURE-FIRST / vertical-slice.**

The repo is organised **by feature**, not by technical layer. Each feature is a
self-contained module holding its own components, data queries, and types. The
broker app and admin console both import from the same feature modules — e.g. a
campaign is *authored* in admin and *displayed* in the broker app, but all
campaign code lives in one place: `/features/campaigns`.

```
/app
  /(broker)        → broker PWA route pages — THIN: compose features only
  /(admin)         → admin console route pages — THIN: compose features only
  /api             → route handlers (ask-alef, etc.)

/features          → the heart of the repo — one folder per feature (a
                     vertical slice). Each contains:
                       components/   → that feature's UI (broker + admin)
                       queries.ts    → that feature's Supabase reads/writes
                       types.ts      → that feature's TypeScript types
                       index.ts      → the feature's public surface (exports)
  /projects          → project authoring (admin) + browsing/detail (broker)
  /campaigns         → "Alef · this week" carousel: author (admin) + display (broker)
  /training          → Academy: modules, quiz builder, tier logic
  /brokers           → roster + profiles (admin) + dummy-account onboarding (broker)
  /booking           → site-visit booking + confirmation
  /brochures         → branded brochure share
  /notifications     → push composer (admin) + in-app feed (broker)
  /engagement        → activity logging + metrics + the engagement-score
                       calculation. Cross-cutting: every activity-generating
                       feature writes here; the admin Overview reads from here.
  /ask-alef          → the AI assistant

/components
  /shared          → cross-feature UI ONLY — logo, icons, Button, Card, Chip,
                     Progress, TierBadge, the phone shell, the admin shell.
                     If UI is used by 2+ features, it lives here.

/lib               → framework-level, non-feature code
  /supabase        → the Supabase client + connection setup
  /ai              → the OpenAI client setup
  utils.ts         → pure shared utilities

/types             → ONLY truly global types. Feature-specific types live in
                     that feature's types.ts.
/public            → assets, PWA manifest, app icons
/docs              → BRD.md, PRD.md, PROJECT_PLAN.md, WORKLOG.md, CLAUDE.md
```

**Structure rules (Claude Code must follow):**
- A new feature = a new folder under `/features` with the four-file shape above.
- Feature code does not reach into another feature's internals — import only
  from a feature's `index.ts`.
- Shared UI primitives go in `/components/shared`, never duplicated per feature.
- Route pages under `/app` stay thin: they import feature components and arrange
  them; they contain no business logic or queries.

---

## 3. Source of truth — the design prototype

A complete, interactive design prototype already exists (built in Claude Design)
and is provided in the handoff bundle. It contains:

- A full broker app (all screens) with a working navigation router.
- A full admin console (six desktop screens).
- A shared state store (`store.jsx`) that defines the data model.
- A "round-trip" artboard proving the admin→app wiring.

**Claude Code instructions regarding the prototype:**
- **Recreate the screens pixel-faithfully** in Next.js + Tailwind. Match the
  visual output: layout, spacing, colors, typography, components.
- **Do NOT copy the prototype's canvas/artboard wrapper** (`DesignCanvas`,
  `DCArtboard`). Those exist only to display mockups. Build real app routes.
- **Do** reuse the prototype's structure as a guide: the component breakdown,
  the `store.jsx` data shapes, and the navigation map are all sound.
- The prototype's admin forms are *visual only* (they display state but inputs
  aren't editable). Claude Code must make them **real, working inputs** that
  write to Supabase.

---

## 4. Users & primary flows

### Broker (mobile)
Splash → Welcome → Name capture (dummy account) → Home → {Academy, Projects,
Brochure share, Booking, Activity, Ask Alef AI}.

### Admin (desktop)
Overview/metrics → {Brokers roster, Projects authoring, Academy authoring,
Campaign authoring, Push composer}.

### The connection (must work end-to-end)
- Admin publishes a **project** → appears in broker Projects list + AI sources.
- Admin publishes an **Academy module** → appears in broker Academy.
- Admin publishes a **campaign card** → appears in broker Home "Alef · this week".
- Admin sends a **notification** → appears in broker in-app notification feed +
  bell badge.
- Broker **activity** (book/share/complete) → rolls up into Admin metrics.

---

## 5. Brand & design system

These are the **official Alef brand values** — confirmed from the Alef Brand
Guidelines v02 (2026). Map them to Tailwind theme tokens.

### 5.1 Color palette

| Token | Brand name | Hex | Usage |
|---|---|---|---|
| `ink` | Trust / Limed Spruce | `#333F48` | Primary — text, headers, nav, primary buttons, the workhorse color |
| `card` | Openness | `#FFFFFF` | Elevated cards / surfaces |
| `bg` | Wild Sand | `#F7F7F7` | App background |
| `accent` | Roots / Santa Fe | `#B6735C` | Accent ONLY — active states, badges, points/tier, key CTAs, used sparingly |
| `accent2` | — | `#9A5E4A` | Darker copper — hover/active |
| `tint` | Belonging | `#F1ECD6` | Warm beige highlight surface |
| `balance` | Balance | `#8797AF` | Soft blue-grey secondary |
| `possibilities` | Possibilities | `#988FC5` | Soft purple supporting |
| `line` | — | `#E5E7EA` | Hairlines, borders |
| Tier colors | — | Bronze `#B07A5C`, Silver `#A8AEB4`, Gold `#C9A464`, Preferred `#333F48` | Loyalty tiers |

**Rule:** navy is the anchor; copper is reserved for moments that matter.
Never make copper the dominant color. No corporate blue, no neon.

### 5.2 Typography
- **Latin:** Helvetica Neue LT Pro (brand font). Fallback stack:
  `"Helvetica Neue", Inter, Helvetica, Arial, sans-serif`.
- **Arabic:** GE SS Two. Fallback: `Tajawal, "Noto Naskh Arabic"`.
- **Mono:** JetBrains Mono (data/code contexts only).
- Scale: display 42 / h1 28 / h2 22 / h3 17 / body 15 / caption 12 / label 11.

### 5.3 Logo
- Two assets provided: `logo-light.png` (navy + copper, for light backgrounds),
  `logo-dark.png` (white + copper, for dark backgrounds).
- **Never redraw or recreate the logo.** Use the asset. Respect clear space.

### 5.4 Visual principles
- Editorial generosity — whitespace, restraint, breathing room.
- Soft shadows, rounded cards (radii: 8/12/16/22/28/pill).
- Warm, calm, premium, architectural. One-handed-first on mobile (bottom-anchored
  actions, ~56px CTAs).

---

## 6. Broker App — screen-by-screen spec

> All screens are mobile-first (≈390px). Recreate from the prototype. Each screen
> below lists its purpose, key elements, data source, and Phase.

### 6.1 Splash — `Phase 1`
Animated Alef logo loading screen. Auto-advances (~3.8s) to Welcome.

### 6.2 Onboarding: Welcome — `Phase 1`
Hero photo, Alef logo, headline, "Get started" CTA.

### 6.3 Onboarding — `Phase 1`
Three screens cover sign-up + profile + welcome:

- **`/signup`** (created 2026-05-28, was Phase 2 item 2.1): email + password
  + confirm. Calls Supabase Auth `signUp`; on success the session cookie is
  set and we redirect to `/onboarding/name`.
- **`/onboarding/name`** (profile capture): Full name (required), Role
  (required, dropdown), Brokerage name (required), Profile photo (optional).
  Submit links a `brokers` row to the current `auth.users` row via
  `brokers.user_id`. If a broker hits this without a session, redirect to
  `/signup`.
- **`/login`** for returning brokers — email + password. After sign-in
  `requireBroker()` decides: if profile exists → `/home`; if not →
  `/onboarding/name` (resume an abandoned signup).

### 6.4 Onboarding: Welcome message — `Phase 1`
"Ahlan, [name]" — confirms enrollment as a Bronze broker. Shows first actions.

### 6.5 Home dashboard — `Phase 1`
- **Header:** Alef logo, notification bell (with unread badge), broker
  avatar (real photo if uploaded, initials fallback). Tap avatar →
  `/profile` to edit name / role / brokerage / photo or sign out.
- **Greeting:** date + "Good morning, [name]".
- **"Alef · this week" carousel:** horizontally scrolling cards (~1.5 visible).
  **Data source:** `campaigns` table, `published = true`, ordered by schedule.
- **Activity snapshot card:** compact — points, tier, progress to next tier.
  **Data source:** the broker's row in `brokers` + computed.
- **Quick actions (3-up):** Book a visit · Share brochure · Resume training.
- **Floating "Ask Alef AI" button:** opens the AI chat screen.
- **Bottom tab bar:** Home · Academy (with pending-count badge) · Projects · Activity.

### 6.6 Ask Alef — AI chat — `Phase 1`
- Claude/ChatGPT-style chat UI. Header: Alef AI avatar, "grounded in Alef data".
- Sends user question → **OpenAI API** with a system prompt that grounds the
  AI in Alef knowledge. Streams the response.
- **Scope** (updated 27 May 2026 — see §12): Alef projects, training modules,
  ongoing/past campaigns, and the broker loyalty program (tiers + points).
  Politely declines anything else.
- **Data sources** (all injected fresh per request):
  - `ai_config.instructions` — editable system-prompt rules.
  - `ai_sources` (enabled rows) — brochure text for indexed projects +
    the editable "Points & tier program" policy copy.
  - `modules` (published) — full training catalog with quiz topics.
  - `campaigns` (published) — ongoing + past.
  - The canonical tier ladder + `brokers` row + completed-module IDs
    for the broker identified by the `broker_id` cookie (per-broker
    context degrades gracefully when no cookie is present).
- See §9 for the AI integration spec.

### 6.7 Academy — `Phase 1`
- **Pending-for-you card:** modules to resume / workshop seats to confirm.
- **Tier rail:** Bronze → Silver → Gold → Preferred, with current position.
- **Segmented control:** Online video modules / Face-to-face workshops.
- **Module cards:** title, duration, points, progress, locked state (tier-gated).
  **Data source:** `modules` table, `published = true`.
- Tapping a module → module detail (video + quiz). **Quiz-taking flow = `Phase 2`**;
  Phase 1 shows the module detail and marks completion via a simple action.

### 6.8 Projects — list — `Phase 1`
- Featured project + list of all communities.
  **Data source:** `projects` table, `published = true`.

### 6.9 Project detail — `Phase 1`
- Hero image/video, title, location, status, facts strip, tabs
  (Overview · Units · Gallery · Training), "Share project brochure" CTA.
- Training tab links into the relevant Academy modules.

### 6.10 Branded brochure share — `Phase 1`
- Brochure preview **personalised** with broker photo, name, phone, brokerage.
- Unit-type filter (e.g. "studios only").
- Share via **WhatsApp** and **email** (deep links / share intent).
- **Each share is logged** as broker activity (writes a row to `activity`).

### 6.11 Booking — book a visit — `Phase 1`
- Pick project, date, time slot; reminder toggle.
- POC: booking is **mocked** to a confirmation screen — no real calendar.
- **Each booking is logged** as broker activity (writes to `activity`).

### 6.12 Booking confirmation — `Phase 1`
Ticket-style confirmation screen.

### 6.13 Reminder (lock screen / in-app) — `Phase 1`
- In-app notification styling. Phase 1: shows in the in-app feed.
- **Real device push = `Phase 2`.**

### 6.14 Activity dashboard — `Phase 1`
- Engagement ring (composite score), metric breakdown bars, stat tiles,
  recent-activity timeline, broker profile photo.
  **Data source:** the broker's `activity` rows + computed engagement score.

---

## 7. Admin Console — screen-by-screen spec

> All screens are desktop (≈1440px). Navy sidebar + topbar + scrolling content.

### 7.1 Overview / Metrics — `Phase 1` — **the ROI screen**
- KPI cards: active brokers, site visits booked, brochures shared, avg
  engagement score.
- Weekly multi-series bar chart: visits / brochures / modules.
- Engagement-score distribution (highly engaged / engaged / at-risk / dormant).
- **Activity → transaction funnel:** brochures shared → visits booked → tours
  completed → offers → transactions.
- Top-brokers leaderboard.
  **Data source:** aggregations over `activity`, `brokers`, `funnel` data.

### 7.2 Brokers — roster & drill-down — `Phase 1`
- Filterable table: name, brokerage, tier, engagement score, visits, shares,
  modules, last active.
- Click a row → drill-down panel: that broker's engagement breakdown + activity
  timeline.
  **Data source:** `brokers` + `activity`.

### 7.3 Projects — author & publish — `Phase 1`
- List of existing projects.
- **Create/upload form (REAL inputs):** name, location, starting price, unit
  types, description, cover image upload, video upload, brochure PDF upload,
  "index for Ask Alef AI" toggle. Publish / save as draft.
  **Writes to:** `projects` table + Supabase Storage.

### 7.4 Academy — author & quiz builder — `Phase 1`
- Module library list.
- **Create-module form (REAL inputs):** type toggle (online video / face-to-face
  workshop), title, linked project, points, tier requirement, duration, video
  upload, and a **quiz builder** (add/remove questions, options, correct answer).
  Publish / save as draft.
  **Writes to:** `modules` table.

### 7.5 Campaigns — home carousel — `Phase 1`
- List of the "Alef · this week" cards.
- **Create-campaign form (REAL inputs):** tag, title, subtitle, image, link
  target, schedule — with a **live preview** of the broker-app card.
  **Writes to:** `campaigns` table.

### 7.6 Push notifications — `Phase 1` (in-app) / `Phase 2` (device push)
- **Compose form (REAL inputs):** title, body, deep-link target, audience
  targeting (all / by tier / by engagement band / by project), schedule.
- Live broker-phone lock-screen preview.
- Phase 1: "send" writes a `notifications` row → appears in the broker in-app
  feed + bumps the bell badge (via Supabase Realtime).
- Phase 2: real web-push to devices.

---

## 8. Data model

These tables map directly from the prototype's `store.jsx`. Implement as
Supabase (Postgres) tables. All POC data is **seed/sample data**.

### 8.1 `projects`
| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | e.g. `hayyan` |
| `name` | text | |
| `location` | text | |
| `tagline` | text | |
| `units` | text | e.g. "2–7 BR Villas" |
| `price_from` | text | e.g. "AED 1.19M" |
| `status` | text | e.g. "Selling · Phase 2" |
| `featured` | bool | |
| `published` | bool | controls visibility in broker app |
| `ai_indexed` | bool | include in Ask Alef sources |
| `cover_image` | text (url) | Supabase Storage |
| `video_url` | text (url) | nullable |
| `brochure_url` | text (url) | PDF in Supabase Storage |
| `facts` | jsonb | array of `[icon, label]` |
| `created_at` | timestamptz | |

### 8.2 `campaigns` (the "Alef · this week" carousel)
| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | |
| `tag` | text | e.g. "Launch", "Webinar" |
| `title` | text | |
| `subtitle` | text | |
| `image` | text (url) | nullable (commission card has no image) |
| `kind` | text | nullable; `commission` = special card style |
| `link_target` | text | route the card opens: `detail`/`projects`/`academy`/`activity` |
| `schedule` | text | e.g. "May 28 — May 31" |
| `published` | bool | |
| `created_at` | timestamptz | |

### 8.3 `modules` (Academy)
| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | |
| `kind` | text | `online` or `live` |
| `title` | text | |
| `project_id` | text (FK→projects) | nullable |
| `points` | int | |
| `duration` | text | online modules |
| `tier_required` | text | Bronze/Silver/Gold/Preferred |
| `published` | bool | |
| `quiz` | jsonb | array of `{q, options[], correct}` |
| `when` | text | live modules — date/time |
| `location` | text | live modules — venue |
| `seats` | text | live modules — availability |
| `created_at` | timestamptz | |

### 8.4 `brokers`
| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | |
| `name` | text | |
| `brokerage` | text | |
| `role` | text | |
| `photo_url` | text | nullable |
| `tier` | text | Bronze/Silver/Gold/Preferred |
| `points` | int | |
| `engagement_score` | int | 0–100, composite (see §8.8) |
| `created_at` | timestamptz | |

### 8.5 `notifications`
| Field | Type | Notes |
|---|---|---|
| `id` | text (PK) | |
| `title` | text | |
| `body` | text | |
| `audience` | text | `all` / `tier:Gold` / `engagement:at-risk` / `project:hayyan` |
| `link_target` | text | nullable |
| `sent` | bool | |
| `sent_at` | timestamptz | |
| `created_at` | timestamptz | |

### 8.6 `activity` (the heart of the measurement system)
Every broker input action writes one row here. This table powers the entire
Admin metrics layer.
| Field | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | |
| `broker_id` | text (FK→brokers) | |
| `type` | text | `visit_booked` / `tour_completed` / `brochure_shared` / `brochure_downloaded` / `module_completed` / `quiz_passed` / `workshop_attended` |
| `project_id` | text (FK→projects) | nullable |
| `module_id` | text (FK→modules) | nullable |
| `meta` | jsonb | channel (WhatsApp/email), unit filter, etc. |
| `created_at` | timestamptz | |

### 8.7 Derived / computed (not stored — calculated)
- **Weekly rollups** for the Overview chart — aggregate `activity` by day/type.
- **Activity → transaction funnel** — counts per stage.
- **Engagement-score distribution** — bucket `brokers.engagement_score`.

### 8.8 Engagement score formula (POC version — keep simple)
A composite 0–100 weighted score per broker, recomputed from `activity`:
```
score =  w1 * normalized(site_visits_booked)
       + w2 * normalized(client_tours_completed)
       + w3 * normalized(brochures_shared)
       + w4 * normalized(modules_completed)
```
Suggested weights (tunable, document any change here):
`w1=0.30, w2=0.30, w3=0.20, w4=0.20`. Normalization is per-metric against a
target ceiling. This formula is intentionally simple for the POC and is the
explicit thing to refine with Alef later.

---

## 9. AI assistant — "Ask Alef" integration spec

- **Provider:** OpenAI API (server-side route handler in `/app/api/ask-alef`).
- **Grounding:** the assistant answers ONLY about Alef projects that are
  `published = true AND ai_indexed = true`. Their brochure text is the context.
- **POC approach (keep simple):** store extracted brochure text per project;
  pass the relevant project(s)' text into the prompt as context. A full vector
  / embeddings RAG pipeline is **Phase 2** — not needed for 3–4 projects.
- **System prompt must enforce:** "You are Alef's broker assistant. Only answer
  questions about Alef Group projects using the provided context. If asked
  anything outside Alef projects, politely decline and redirect."
- **Never** put API keys in client code — server-side only, via env vars.
- Stream responses to the chat UI.

---

## 10. Phasing — what to build when

> The detailed, checkbox-tracked plan lives in **PROJECT_PLAN.md**. This is the
> summary. Phase 1 is the CEO-demo POC.

### Phase 1 — POC (the demo)
Project scaffold, design system, all broker screens, all admin screens, Supabase
schema + seed data, admin forms writing to DB, broker app reading from DB, the
admin→app round-trip, the Ask Alef AI assistant, PWA config, deploy to Vercel.

### Phase 2 — Productionization (post-CEO buy-in)
Real broker auth + RERA verification, real device push, quiz-taking flow,
real booking calendar, embeddings-based AI RAG, Arabic (RTL) UI, analytics
hardening, role-based admin access.

### Phase 3 — Integration & scale
Alef CRM integration, contracts/payments, data warehouse for engagement
analytics, native app wrappers, AWS migration for video/scale.

---

## 11. Non-functional requirements
- **Performance:** broker app must feel instant on mobile; lazy-load images.
- **Responsive:** broker app mobile-first; admin desktop-first.
- **PWA:** installable, valid manifest, app icons, offline shell.
- **Security:** no secrets in client code; all keys via env vars; Supabase RLS
  considered for Phase 2.
- **Accessibility:** sensible contrast (brand palette is compliant), focus
  states, semantic HTML.
- **Code quality:** TypeScript throughout; feature-first structure (PRD §2) —
  each feature self-contained; feature-specific types in that feature's
  `types.ts`, only global types in `/types`; components small and reusable.
  small and reusable.

---

## 12. Open questions / decisions log
> Claude Code: append decisions here as they are made, with date.

- **[26 May 2026]** Stack decided: Next.js + Supabase + OpenAI, GitHub → Vercel.
- **[26 May 2026]** Backend posture: hybrid — real DB, dummy-account onboarding
  (no real login in POC).
- **[26 May 2026]** Hosting: Vercel (chosen over Railway for Next.js fit).
- **[26 May 2026]** Repo structure: **feature-first / vertical-slice** — code
  organised by feature under `/features`, not by technical layer (see §2).
- **[26 May 2026]** Project scaffolded in-place into the existing
  `alef-broker-platform/` directory via `create-next-app` (App Router, TS,
  Tailwind, no `src/`, `@/*` alias). `Docs/` renamed to lowercase `docs/`
  to match the documented paths and behave correctly on case-sensitive
  filesystems (Linux/Vercel).
- **[26 May 2026]** Default branch left as `master` from create-next-app for
  the local-only first commit; rename to `main` deferred until the GitHub
  remote exists, to avoid a stale local default.
- **[26 May 2026]** `AGENTS.md` (auto-generated by create-next-app, contains a
  Next.js "breaking changes" notice for future agents) kept at repo root and
  pulled into `CLAUDE.md` via `@AGENTS.md` so it loads automatically.
- **[26 May 2026]** Claude Design handoff bundle fetched and studied (URL:
  `https://api.anthropic.com/v1/design/h/kS6ADuMaFiolE2B6tvTPAQ`). Bundle is
  21 MB; extracted to `design/` (gitignored). All 14 broker screens + 6 admin
  screens enumerated and confirmed to map to PRD §6/§7. Brand **palette**
  matches PRD §5.1 exactly (every hex code). All 4 communities in §6.8 are
  in the seed (Hayyan, Al Mamsha, Olfah, Palace Residences, all `aiIndexed`).
- **[26 May 2026]** Typography decision **resolved** — primary Latin family
  is **Helvetica Neue LT Pro** (confirmed by Samir against the brand-guidelines
  PDF). PRD §5.2 is correct as written. The design bundle's `tokens.jsx` use
  of Neue Haas Grotesk Display/Text Pro will be overridden in 1.1.2; the
  fallback stack stays `"Helvetica Neue", Inter, Helvetica, Arial, sans-serif`
  per PRD §5.2.
- **[27 May 2026]** Tailwind v4 (CSS-config-driven) confirmed as the styling
  stack — `tailwind.config.{js,ts}` is intentionally absent; theme tokens live
  in `app/globals.css` inside `@theme inline`. The Tailwind v4 utility classes
  (`text-display`, `text-h1`, `rounded-pill`, `shadow-soft-md`, `text-accent`,
  `bg-ink`, etc.) are derived from those CSS variables.
- **[27 May 2026]** Fallback web fonts loaded via `next/font/google`:
  **Inter** (Latin fallback for Helvetica Neue LT Pro), **Tajawal** (Arabic
  fallback for GE SS Two), **JetBrains_Mono** (mono). Proprietary brand
  families are not loaded server-side; users with them installed get them via
  the `font-family` cascade in PRD §5.2.
- **[27 May 2026]** Curated subset of the design bundle committed to git:
  logos to `/public`, brand-guidelines PDF to `/docs/assets`, and
  `design/alef/project/src/store.jsx` un-ignored. The rest of `design/` is
  gitignored.
- **[27 May 2026]** ESLint config updated to ignore `design/**` — the
  prototype's JSX relies on `<script>`-injected globals, not ES imports.
- **[27 May 2026]** Supabase project created at `qiowxcaofwjahlwycwbl`
  (`alef-broker-platform`, eu-central-1, $10/month — DEvsam org's free
  slot was unavailable so this is a paid project; pausing it any time stops
  billing).
- **[27 May 2026]** Client env var renamed `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. We use the modern Supabase
  publishable key (`sb_publishable_...`) instead of the legacy JWT-anon
  key, per Supabase's recommendation for new applications. supabase-js v2
  accepts either format identically; the rename is for clarity.
- **[27 May 2026]** Column rename: PRD §8.3 lists a `when` column on
  `modules` — it became `when_at` in Postgres because `when` is a reserved
  word and quote-escaping it in every query is friction with no benefit.
- **[27 May 2026]** Quiz JSON normalized to PRD §8.3 shape
  `{ q, options[], correct }`. The design's `store.jsx` used `{ q, a, correct }`;
  the data is identical but the field name was updated when seeded.
- **[27 May 2026]** Campaign `objectPosition` (CSS `object-position` value
  for image crop) was carried in the design's `store.jsx` but has no PRD
  column. **Dropped from the seed** — cosmetic-only; we can re-introduce a
  column or a `meta jsonb` if the demo needs the exact crop.
- **[27 May 2026]** PRD §8.7 "derived" weekly + funnel rollups stay as
  **constants in code for Phase 1** (not aggregated from the `activity`
  table). The seeded activity has exactly the per-broker counts from
  SEED_BROKERS, which is too small to look like the design's network-wide
  network. Wiring real aggregation is Phase 2.
- **[27 May 2026]** Project image columns (`cover_image`, campaign `image`)
  store bare filenames for Phase 1. Resolution to full URLs (local `/public/`
  vs Supabase Storage) is deferred to 1.3.9 / 1.5.4.
- **[27 May 2026]** Row Level Security is **disabled** on all 6 tables for
  Phase 1 (intentional — POC has dummy onboarding, no real users). Supabase
  advisor flagged this as critical; PROJECT_PLAN item 2.7 owns the
  remediation in Phase 2.
- **[27 May 2026]** **URL routing.** Broker app routes live at root URLs
  (`/`, `/home`, `/projects`, `/projects/[id]`, `/projects/[id]/brochure`,
  `/booking`, `/booking/confirmation`, `/notifications`, `/activity`,
  `/academy`, `/academy/[id]`, `/welcome`, `/onboarding/name`,
  `/onboarding/done`, `/brochure`). Admin will live under `/admin/*` in 1.5.
  PRD §2's `(broker)` and `(admin)` route groups stay as folder names —
  they're URL-invisible. The old `/` design-system check page from 1.1 was
  replaced by the splash.
- **[27 May 2026]** **Image-path resolution.** Database stores full
  `/assets/<filename>` paths in `projects.cover_image` and `campaigns.image`
  rather than bare filenames. Decision: keep the resolution in the DB so
  the React `<Image>` consumer can use the column verbatim; if we later
  migrate to Supabase Storage URLs, it's just another UPDATE.
- **[27 May 2026]** **Dummy account persistence.** A `broker_id` cookie
  (set by the `onboardBroker` server action on submit) carries identity
  across requests. Read server-side via `getBrokerIdFromCookie()` in
  `lib/dummy-account.ts`. No `httpOnly` so the demo can drop it from
  devtools to re-run onboarding. Phase 2 replaces with real Supabase Auth.
- **[27 May 2026]** **Five-file feature shape.** PRD §2 specifies four
  files per feature (`components/`, `queries.ts`, `types.ts`, `index.ts`).
  Features that need writes callable from client components (brokers,
  engagement, booking) carry an additional `actions.ts` (`'use server'`).
  Without the split the index would barrel both server-only reads and
  client-callable writes, which Next.js 16 / React Server Components
  refuses.
- **[27 May 2026]** **Client-safe feature indexes.** All feature `index.ts`
  files re-export only types + actions + UI components (i.e. content safe
  to bundle into client components). Server-only reads in `queries.ts` are
  deep-imported by server consumers: `import { listX } from
  '@/features/<name>/queries'`. The "import only from index.ts" rule in
  PRD §2 holds for the client-facing surface.
- **[27 May 2026]** **Tier ladder thresholds** (used by the snapshot
  card, Academy tier rail, and the next-tier copy): `Bronze 0 / Silver
  1000 / Gold 2500 / Preferred 5000`. Derived from the design's commission
  card ("Gold now from 2,500 pts") and the seeded brokers' points
  distribution. To refine with Alef alongside the engagement-score
  weights.
- **[27 May 2026]** **Initial-based avatars.** Seeded brokers have no
  `photo_url`. New `<Avatar>` primitive in `/components/shared` derives
  initials from the name and renders them on a copper background.
- **[27 May 2026]** **Quiz-taking deferred.** Module detail at
  `/academy/[id]` shows a single "Mark complete" CTA that writes
  `module_completed` activity (per PRD §6.7's "Phase 1 marks completion
  via a simple action"). Full quiz UI is Phase 2.
- **[27 May 2026]** **Engagement score is stored, not recomputed.** The
  Activity dashboard reads `brokers.engagement_score` as a static column
  for Phase 1; live recompute via the PRD §8.8 formula is Phase 2.
- **[27 May 2026]** **Config-driven AI (Ask Alef).** The assistant is NOT
  hardcoded. Two new tables hold its behaviour:
  - `ai_config` — singleton "default" row carrying `instructions`,
    `model`, `temperature`, `max_output_tokens`, `updated_at`.
  - `ai_sources` — knowledge corpus, one row per brochure / doc / note,
    with `enabled`, `sort_order`, optional `project_id` FK, `content`
    and optional `file_url`.
  The `/api/ask-alef` route loads both at request time, so the admin
  AI Training screen (1.5.8) can edit instructions or add knowledge
  sources without redeploying. Seed: one ai_config "default" row + 4
  ai_sources brochure entries (Hayyan, Al Mamsha, Olfah, Palace
  Residences).
- **[27 May 2026]** **OpenAI defaults.** `gpt-4o-mini` (cheapest current
  OpenAI model — ~$0.15/$0.60 per million in/out tokens), temperature
  0.4, `max_completion_tokens` 600. All editable from `ai_config`.
- **[27 May 2026]** **AI grounding posture.** Per PRD §9 we keep Phase 1
  simple — full source text is concatenated into the system prompt at
  request time. Vector / embeddings RAG is deferred to Phase 2
  (PROJECT_PLAN 2.5). Comfortable for ~4 KB of brochure text today.
- **[27 May 2026]** **Streaming wire format.** `/api/ask-alef` returns
  raw delta text as `Content-Type: text/plain; charset=utf-8` chunked
  body (not SSE). Client uses `fetch` + a `ReadableStream` reader; the
  in-flight assistant bubble re-renders per chunk.
- **[27 May 2026]** **/ask-alef sits OUTSIDE the (broker)(app) layout.**
  The chat's own bottom input bar would clash with the floating tab
  bar; the chat is a full-screen surface with a back link to /home. The
  `AskAlefFAB` on /home is what opens it.
- **[27 May 2026]** **Demo affordance on /welcome.** A POC-only "Demo ·
  Continue as Layla Hassan" form button calls the
  `continueAsDemoBroker` server action, which sets the `broker_id`
  cookie to `b1` and redirects to /home. Clearly labelled so a real
  broker doesn't tap it by accident. Replaces the previously-broken
  "Already enrolled? Sign in" link on /welcome.
- **[27 May 2026]** **New admin task: 1.5.8 AI Training.** Edit the AI's
  instructions, model knobs, and the `ai_sources` library (add / edit /
  toggle / delete; optional file upload that extracts text into a
  source row). Added to PROJECT_PLAN under section 1.5.
- **[27 May 2026]** **Admin Overview funnel synthesis.** The activity →
  transaction funnel renders real per-stage counts for the activity
  types we capture today (`brochure_shared`, `visit_booked`,
  `tour_completed`). When `tour_completed` is empty it falls back to
  `0.82 × visits`. Offers / transactions are always synthesised from
  visits via the design's SEED_FUNNEL ratios (26 % / 10 %). When real
  activity rows of those types start landing (1.6 round-trip) the
  fallback decays gracefully.
- **[27 May 2026]** **Module video upload deferred.** PRD §7.4 lists
  "video upload" but PRD §8.3's `modules` schema has no `video_url`
  column. Phase 2 owns the schema migration + real upload wire.
- **[27 May 2026]** **AI Training PDF-to-text auto-extraction deferred.**
  1.5.8 accepts a brochure PDF upload (stored at `ai_sources.file_url`)
  but extracting its text into `ai_sources.content` is Phase 2; the
  operator pastes the extracted text by hand for Phase 1.
- **[27 May 2026]** **Admin layout is a thin client wrapper.**
  `app/(admin)/admin/layout.tsx` is `'use client'` so it can call
  `usePathname` and pass `route` to `<AdminShell>`. Pages stay server
  components; the client touchpoint is the layout only.
- **[27 May 2026]** **Admin form `action={…}` convention** (Next.js 16
  gotcha). Server actions are passed **directly** as
  `<form action={serverAction}>`. Wrapping in an inline async closure
  that captures local React state (e.g. `setPending`) breaks at the
  `<form>` element with a misleading `TypeError: Failed to fetch` —
  Next 16 can't serialise the closure across the server-action
  boundary. Pending state comes from React's `useFormStatus` hook
  inside a new shared `<SubmitButton>` primitive. Applies to all six
  admin authoring forms. Forms that need client-side mediation before
  submit (e.g. broker BookingForm) keep using
  `<form onSubmit>` + `useTransition`.
- **[27 May 2026]** **Notifications use Supabase Realtime (Phase 1).**
  `public.notifications` is on the `supabase_realtime` publication.
  The broker's `<NotificationBell>` client component subscribes to
  `postgres_changes` INSERT events; on a hit it bumps the badge
  optimistically and calls `router.refresh()` so the
  `/notifications` server component + tab badge stay in lock-step.
  Real device push (web-push to a closed PWA) is Phase 2
  (PROJECT_PLAN 2.2). Realtime gives the live demo experience
  PRD §7.6 calls for without standing up a separate push service.
- **[27 May 2026]** **`ai_sources.enabled` follows
  `projects.ai_indexed`.** `upsertProject` (admin) writes a follow-up
  UPDATE on `ai_sources` so every source pointed at the project
  flips with the project's AI-index toggle. Without this, toggling
  `ai_indexed=false` left the source row enabled and Ask Alef kept
  quoting the brochure. PRD §6.6 says the AI uses
  `projects.ai_indexed=true` as the source filter — this enforces
  that contract.
- **[27 May 2026]** **Broker writes revalidate admin paths.**
  `submitBooking` and `logActivity` (broker-side actions) now call
  `revalidatePath('/activity', '/admin', '/admin/brokers',
  /admin/brokers/[broker_id])`. Without this, broker activity rows
  reach the database but the admin Overview + Brokers roster serve
  stale Next.js cache until manual hard-reload. The round-trip
  required revalidation symmetry: admin writes already invalidated
  broker paths; this completes the loop.
- **[27 May 2026]** **Programmatic PWA icons via `next/og`.** The
  manifest's 192px + 512px + 32px + 180px icons are generated by
  TSX files (`app/icon*.tsx`, `app/apple-icon.tsx`) using
  `ImageResponse`, not committed PNGs. Easier to tweak / re-style
  than binary blobs and keeps the repo lean. If Alef ships an
  official square brand symbol later, dropping a PNG at the same
  path overrides the generated version (Next.js prefers a literal
  file over a generator).
- **[27 May 2026]** **Profile photo on onboarding (back-fill).** PRD §6.3
  lists "Profile photo (optional, skippable)" as a name-capture field;
  the 1.3.3 build shipped without it. Back-filled: new `broker-photos`
  public Storage bucket (alongside the existing `project-images` /
  `brochures` / `videos`), `onboardBroker` now takes a `FormData`
  with an optional `photo` File entry and writes the resulting URL to
  `brokers.photo_url`, and `NameForm` exposes a circular photo-picker
  above the field list with a live preview + "Remove photo" toggle.
  Empty `<input type="file">` selections come through as a File of
  size 0 — the action guards on `size > 0` so unset photos don't
  trigger an upload.
- **[27 May 2026]** **Reconnect flow stays cookie-only (confirmed).**
  Samir confirmed that real "sign in" / reconnect is deferred to
  Phase 2 (item 2.1, real broker auth + RERA verification). The POC
  has exactly two entry paths on `/welcome`: fresh onboarding via
  "Get started", or the "Continue as Layla (demo)" affordance. If a
  broker clears their cookie they go through onboarding again — that
  is by-design for the POC.
  **SUPERSEDED 2026-05-28**: real auth brought forward (see below).
- **[28 May 2026]** **Profile editor at `/profile`.** New broker-app
  screen reached by tapping the avatar in `AppHeader`. Mirrors the
  `/onboarding/name` form (same name/role/brokerage/photo fields,
  same FormData wire format) seeded with the broker's current values
  + email shown read-only. `updateBrokerProfile` server action does
  the UPSERT, uploads a new photo to `broker-photos` if changed,
  honours a "Remove photo" affordance via a hidden `clear_photo`
  field, and revalidates every path where the avatar surfaces (home,
  projects, academy, activity, booking, notifications, admin roster
  + drill-down + leaderboard). Sign-out lives here too (in addition
  to /activity) so /profile is the one-stop account surface.
- **[28 May 2026]** **Avatar `photo_url` plumbed through.**
  `Avatar` already supported a `src` prop but no caller was passing
  it — broker photos uploaded at onboarding were ignored everywhere.
  Now `AppHeader` accepts `brokerPhotoUrl` and passes it; same
  treatment in `/activity` snapshot, `/onboarding/done`, brochure
  share preview, admin `BrokerRosterTable`, admin
  `brokers/[id]` drill-down, and the admin overview `Leaderboard`
  (which needed `LeaderboardBroker` to learn the new column and
  the underlying query updated to select it).
- **[28 May 2026]** **Real auth — PROJECT_PLAN 2.1 brought forward**
  into Phase 1 at Samir's request. Email + password via Supabase
  Auth, picked over magic-link / phone-OTP / Google-Apple OAuth
  for familiarity + zero external dependencies. New screens
  `/signup` + `/login`, sign-out button at the bottom of /activity,
  middleware auto-refresh of the JWT cookie. `brokers.user_id`
  links to `auth.users.id`. The seeded brokers (b2–b8) stay
  intact with `user_id = null` — only Layla (b1) is linked to a
  provisioned auth account so the "Continue as Layla" demo still
  works (creds in env: `DEMO_BROKER_EMAIL` /
  `DEMO_BROKER_PASSWORD`). RERA card verification stays in Phase 2
  — manual review workflow not blocking the demo. RLS hardening
  (PROJECT_PLAN 2.7) also still Phase 2. The pre-auth
  `lib/dummy-account.ts` cookie helper was deleted; 13 broker-app
  pages migrated to `requireBroker()` / `getCurrentBroker()` from
  `lib/auth.ts`.
- **[27 May 2026]** **AI scope expanded beyond projects (PRD §6.6
  update).** Original PRD §6.6 said "restrict answers to indexed
  Alef projects only". Samir confirmed in chat: the AI should also
  cover (a) all training modules (catalog + per-broker completion
  status + content), (b) ongoing and past campaigns, and (c) the
  broker loyalty program (general tier rules + the asking broker's
  own points/tier). Implementation: `/api/ask-alef/route.ts` now
  reads the `broker_id` cookie and runs five extra queries in
  parallel with the existing config/sources fetch — modules,
  campaigns, broker row, completed-module IDs, tier ladder — and
  formats each as a system-prompt block ("TRAINING CATALOG",
  "CAMPAIGNS", "TIER LADDER", "CURRENT BROKER"). Per-broker context
  degrades gracefully when no cookie is present. The catalog data
  is always live (queried fresh per request), so admin edits in
  /admin/academy or /admin/campaigns take effect on the next chat
  reply with no cache to bust. Token budget impact: ~3.5 KB extra
  on the system prompt, well within `gpt-4o-mini`'s 128k window.
- **[27 May 2026]** **Shared tier ladder lives in
  `features/brokers/tiers.ts`.** Previously the ladder (Bronze 0 /
  Silver 1k / Gold 2.5k / Preferred 5k) was hard-coded in
  `app/(broker)/(app)/home/page.tsx` only. Extracted to a shared
  module exporting `TIERS`, `TIER_BENEFITS`, `POINTS_RULES`,
  `getCurrentTier`, `nextTier`, `progressTowardNext`. Imported by
  the broker home snapshot card AND the Ask Alef route handler so
  both surfaces always agree. `Tier` is still declared once in
  `components/shared/TierBadge.tsx` (the shared-primitive layer);
  `tiers.ts` re-exports it.
- **[27 May 2026]** **"Points & tier program" ai_source.** New
  editable knowledge row seeded via the
  `expand_ai_scope_modules_campaigns_points` migration. Holds the
  narrative copy the AI quotes when a broker asks how points work
  or what each tier unlocks. Admin can edit at
  `/admin/ai-training/source/<id>` to tune the program rules
  without a code change (the dynamic catalog blocks remain
  code-controlled — only the policy narrative is editable here).
- **[27 May 2026]** **Onboarding starter cards weren't clickable.**
  `/onboarding/done`'s two starter affordances ("Start with
  Foundation", "Explore Alef projects") were rendered as bare
  `<Card><div>` with no href — clicks went nowhere. Wrapped each
  Card in a Next.js `<Link>` pointing at `/academy` and `/projects`
  respectively. PRD §6.4 lists these as starter affordances; the
  original 1.3.4 build omitted the link wrapping.
- **[27 May 2026]** **Minimal service worker for offline shell.**
  `public/sw.js` precaches `/offline` on install and only intercepts
  navigation requests (HTML pages), falling back to the cached
  shell on network failure. JS/CSS chunks are not precached —
  Next.js fingerprints them per build, so any static list would go
  stale immediately. Browser cache is good enough for the POC. Real
  web-push registration (PRD §7.6 Phase 2) will add `push` /
  `notificationclick` listeners to this same SW file.
- _[open]_ Final engagement-score weights — to be refined with Alef.
- _[open]_ Which 3–4 projects' brochures are indexed for the AI at
  launch — Phase 1 seed uses all 4 indexed projects from the seed
  data (Hayyan, Al Mamsha, Olfah, Palace Residences). Replace the
  derived brochure text with the actual brochure PDFs once Alef hands
  them over (via the AI Training screen).

---

## 13. Related documents
- **BRD.md** — business context and rationale.
- **PROJECT_PLAN.md** — phased checklist; update after every step.
- **WORKLOG.md** — append-only log of all work done.
- **CLAUDE.md** — standing instructions; read every session.

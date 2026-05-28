# CLAUDE.md — Standing Instructions for Claude Code

@AGENTS.md

**Project:** Alef Broker Platform
**Owner:** Samir Skif
**Read this file at the start of EVERY session, before doing anything else.**

---

## 0. What this project is

A two-part platform for Alef Group (Sharjah real estate developer):
a **Broker App** (mobile PWA) and an **Admin Console** (desktop web app),
sharing one Supabase database. See `docs/BRD.md` (why) and `docs/PRD.md` (what).

---

## 1. MANDATORY workflow — every single session

Before you write or change ANY code, in this order:

1. **Read `docs/CLAUDE.md`** (this file).
2. **Read `docs/BRD.md`** — business context.
3. **Read `docs/PRD.md`** — the product spec. This is the source of truth for
   *what* to build.
4. **Read `docs/PROJECT_PLAN.md`** — see what is done, what is next.
5. **Read the tail of `docs/WORKLOG.md`** — see what the last session did.

Then, after EVERY meaningful step (a feature, a screen, a fix):

6. **Update `docs/PROJECT_PLAN.md`** — tick completed checkboxes `[x]`, adjust
   estimates, note blockers.
7. **Append an entry to `docs/WORKLOG.md`** — use the entry format in §5.
   Mark every completed step as **DONE by default** and record its details.
8. **Update `docs/PRD.md` §12 (Open questions / decisions log)** if you made any
   product or technical decision.
9. **Commit to GitHub** with a clear message referencing the plan item.

**If the user's prompt does not explicitly mention these steps, do them anyway.**
They are standing rules, not per-prompt requests.

---

## 2. Golden rules

- **The PRD wins.** If a prompt conflicts with `PRD.md`, pause and ask the user.
- **Phase discipline.** Only build Phase 1 items unless told otherwise. Phase 2
  and 3 items are explicitly deferred — do not build them early, do not delete
  their placeholders.
- **Never invent scope.** If something is ambiguous, ask before building.
- **Never lose work.** `WORKLOG.md` is append-only. Never delete past entries.
- **Keep docs in sync with reality.** The plan and log must always reflect the
  true state of the codebase. Stale docs are a bug.
- **No secrets in code.** All keys (Supabase, OpenAI) via environment variables.
  Never commit `.env`. Maintain `.env.example` with placeholder keys.
- **Small commits.** One logical change per commit, clear messages.

---

## 3. Coding discipline

> Behavioural guidelines to reduce common LLM coding mistakes. They bias toward
> caution over speed. For trivial tasks, use judgment.

### 3.1 Think before coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 3.2 Simplicity first
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3.3 Surgical changes
**Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused; leave
  pre-existing dead code alone unless asked.
- The test: every changed line should trace directly to the request.

### 3.4 Goal-driven execution
**Define success criteria. Loop until verified.**
- Transform tasks into verifiable goals:
  - "Add validation" → "Write tests for invalid inputs, then make them pass"
  - "Fix the bug" → "Write a test that reproduces it, then make it pass"
  - "Refactor X" → "Ensure tests pass before and after"
- For multi-step tasks, state a brief plan with a verify check per step.
- Strong success criteria let you loop independently; weak ones ("make it
  work") cause constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer
rewrites due to overcomplication, and clarifying questions come before
implementation rather than after mistakes.

---

## 4. Tech stack & repo structure (locked — see PRD §2)

Next.js (App Router, TypeScript) · Tailwind CSS · Supabase (Postgres, Storage,
Realtime) · OpenAI API · GitHub · deployed on Vercel.

- Broker app = `/app/(broker)` · Admin = `/app/(admin)`.
- Backend posture: real Supabase DB + **real Supabase Auth (email + password)**.
  Phase 2 item 2.1 was brought forward 28 May. `auth.users` linked to
  `brokers.user_id`. Middleware auto-refreshes JWT cookies. RERA card
  verification and RLS hardening still Phase 2 (items 2.1 second-half / 2.7).
- Do NOT introduce new frameworks/services without updating PRD §2 and asking.

**Repo is FEATURE-FIRST (vertical slices) — see the full tree in PRD §2:**
- Code is organised **by feature**, not by technical layer. Each feature lives
  in `/features/<name>` with `components/`, `queries.ts`, `types.ts`, `index.ts`.
- Features: `projects`, `campaigns`, `training`, `brokers`, `booking`,
  `brochures`, `notifications`, `engagement`, `ask-alef`.
- The broker app and admin console both import from the same feature modules
  (e.g. a campaign is authored in admin, displayed in the broker app — all
  campaign code is in `/features/campaigns`).
- A new feature = a new `/features/<name>` folder with that four-file shape.
- Import only from a feature's `index.ts` — never reach into its internals.
- Cross-feature UI primitives go in `/components/shared`, never duplicated.
- Route pages under `/app` stay THIN — compose features, no logic or queries.

---

## 5. WORKLOG entry format

Append to `docs/WORKLOG.md`. Newest entries at the bottom. Use exactly this:

```
### [YYYY-MM-DD HH:MM] — <short title>
- **Phase / Plan item:** <e.g. Phase 1 · 1.3 Build Home dashboard>
- **Status:** DONE | IN PROGRESS | BLOCKED
- **What I did:** <concise description of the actual work>
- **Files changed:** <list of files created/edited>
- **Decisions made:** <any choice made, or "none">
- **Tested:** <how it was verified, or "not yet">
- **Next:** <the immediate next step>
- **Notes for the user:** <anything Samir needs to know / action needed>
```

---

## 6. PROJECT_PLAN update rules

- Mark items `[x]` when DONE, `[~]` when IN PROGRESS, `[!]` when BLOCKED,
  `[ ]` when not started.
- If you discover a needed step that isn't in the plan, ADD it (don't silently
  do extra work) and note it in the worklog.
- Keep the "Current status" line at the top of the plan accurate.
- At the end of each session, the plan must let anyone see exactly where things
  stand.

---

## 7. When you need the user to act

Some steps need Samir (account creation, keys, asset uploads). When you hit one:
- Mark the plan item `[!] BLOCKED — needs user`.
- Write a clear, numbered instruction in the worklog under "Notes for the user".
- For **Supabase setup specifically:** guide Samir step by step — creating the
  project, getting the URL and anon/service keys, and where to paste them.
  Do not attempt to create accounts on his behalf.

---

## 8. Design fidelity

- A design prototype is provided in the handoff bundle. Recreate its screens
  faithfully (layout, color, type, spacing).
- Do NOT copy the prototype's `DesignCanvas` / `DCArtboard` wrapper — build real
  routes instead.
- The prototype's `store.jsx` defines the data model — follow it (see PRD §8).
- Brand palette and typography are in PRD §5 — follow exactly.

---

## 9. Definition of done (per screen/feature)

A Phase 1 item is DONE when:
- It matches the prototype visually.
- It reads/writes the correct Supabase data (or documented mock if DB not yet wired).
- It is responsive (broker = mobile-first, admin = desktop-first).
- Navigation in/out of it works.
- `PROJECT_PLAN.md` and `WORKLOG.md` are updated.
- It is committed to GitHub.

---

## 10. Reference

- `docs/BRD.md` — business requirements
- `docs/PRD.md` — product requirements (the spec)
- `docs/PROJECT_PLAN.md` — phased checklist
- `docs/WORKLOG.md` — append-only work log

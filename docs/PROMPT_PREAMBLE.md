# PROMPT_PREAMBLE.md — paste this at the top of EVERY Claude Code message

> Copy the block below and paste it before your actual instruction every time
> you message Claude Code. It enforces the read-first / update-after discipline.

---

```
Before doing anything: read docs/CLAUDE.md, docs/BRD.md, docs/PRD.md,
docs/PROJECT_PLAN.md, and the tail of docs/WORKLOG.md. Follow the mandatory
workflow in CLAUDE.md.

After completing the work below: mark every finished step in
docs/PROJECT_PLAN.md (use [x]/[~]/[!]), append a dated entry to docs/WORKLOG.md
in the CLAUDE.md §4 format, update PRD.md §12 if you made any decision, and
commit to GitHub. Do this even though I am not repeating it each time.

If anything conflicts with the PRD, or you need an account/key/asset from me,
stop and ask before building.

--- TASK ---
<your specific instruction for this session goes here>
```

---

## Example first message to Claude Code

```
Before doing anything: read docs/CLAUDE.md, docs/BRD.md, docs/PRD.md,
docs/PROJECT_PLAN.md, and the tail of docs/WORKLOG.md. Follow the mandatory
workflow in CLAUDE.md.

After completing the work below: mark every finished step in
docs/PROJECT_PLAN.md, append a dated entry to docs/WORKLOG.md, update PRD.md
§12 if you made any decision, and commit to GitHub.

If anything conflicts with the PRD, or you need an account/key/asset from me,
stop and ask before building.

--- TASK ---
Start Phase 1, section 1.0 (Project setup). Initialise the Next.js + TypeScript
project, add Tailwind, create the repo structure from PRD §2, set up the GitHub
repo, create .env.example, and move the docs into /docs. Then stop and report
before starting 1.1.
```

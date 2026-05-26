# Alef Broker Platform — Business Requirements Document (BRD)

**Document owner:** Samir Skif
**Version:** 1.0
**Last updated:** 26 May 2026
**Status:** Active — POC phase

> This is the *why* of the project. It explains the business problem, the
> opportunity, who the users are, and what success looks like. The companion
> **PRD.md** covers the *what* — screens, data model, features and phases.
> Claude Code should read this for context before making product decisions.

---

## 1. Executive summary

Alef Group is a premium, design-led real estate developer in Sharjah, UAE.
Roughly **85% of Alef's sales come through external real estate brokers**, not
an internal sales team. Despite this dependency, Alef has **no visibility into
broker engagement or effort** — it can only see the final outcome (a closed
transaction), never the activities that lead up to it.

This project delivers a **two-part platform**:

1. **Alef Broker App** — a mobile-first Progressive Web App (PWA) that gives
   brokers a single home for training, projects, branded brochures, site-visit
   booking, and an AI assistant.
2. **Alef Admin Console** — a desktop web app for Alef HQ to author content
   (projects, training, campaigns, notifications) and — critically — to
   **measure broker engagement** through the activity the app captures.

The strategic insight: by embedding measurement into a tool brokers *want* to
use, Alef converts invisible broker effort into **input metrics** it can manage,
coach against, and tie to a loyalty program.

---

## 2. The business problem

| Problem | Consequence |
|---|---|
| 85% of sales depend on brokers, but Alef has no broker engagement data | Cannot identify, reward, or coach high-effort brokers |
| The only measurable signal is the transaction itself (an *output*) | No leading indicators; problems are only visible after a deal is lost |
| Brokerages will not collect activity data on Alef's behalf | Alef must capture the signal itself, at the broker-individual level |
| No structured training → inconsistent product knowledge across brokers | Weaker pitches, slower deals, brand told inconsistently |
| No loyalty mechanism for brokers | No reason for a broker to favour Alef stock over a competitor's |

---

## 3. The core thesis — input metrics

Selling is an **output**. You cannot manage an output directly; you manage the
**inputs** that produce it. The platform's reason for existing is to capture the
broker **input activities** that precede a sale:

1. **Site visits booked** — broker schedules a visit to an Alef sales office or
   project site.
2. **Client property tours** — broker brings a client to view a property.
3. **Brochure downloads & shares** — broker downloads a project brochure and
   shares it with a client (branded with the broker's details).
4. **Training engagement** — modules completed, quizzes passed, points earned,
   workshop attendance.

These activities, captured per broker, roll up into a **composite engagement
score** and an **activity → transaction funnel**. This is the ROI story: Alef
can finally see which brokers are engaged *before* a deal closes, and can prove
that engaged brokers convert at a higher rate.

---

## 4. Goals & success criteria

### 4.1 POC goals (immediate)
- Deliver a working, shareable prototype that demonstrates the full vision.
- Produce a **"wow" demo** for the Alef CEO/VP: open the admin console, publish
  something, watch it appear live in the broker app.
- Show the **engagement measurement** clearly enough that the ROI argument lands.
- Position Samir Skif as the person who saw the opportunity and brought the
  solution — leading to a consulting engagement or role.

### 4.2 POC success criteria
- A live URL the CEO can open on a phone (broker app) and desktop (admin).
- The three "wow" moments work: **AI assistant**, **branded brochure share**,
  **engagement dashboard**.
- The admin → app round-trip works: a publish in admin surfaces in the app.
- The platform looks authentically Alef-branded.

### 4.3 Product goals (if it proceeds beyond POC)
- Increase measurable broker engagement quarter over quarter.
- Demonstrate a statistical link between engagement score and deal conversion.
- Reduce time-to-productivity for newly onboarded brokers via the Academy.
- Create a broker loyalty tier system that makes Alef the preferred developer.

---

## 5. Users & stakeholders

| User | Role | Primary needs |
|---|---|---|
| **Broker** (e.g. "Layla Hassan") | External agent selling Alef projects | Learn projects fast, share branded brochures, book visits, earn status |
| **Alef HQ operator / admin** (e.g. "Samir Skif") | Authors content, monitors engagement | Publish projects/training/campaigns, send notifications, read metrics |
| **Alef CEO / VP** | Decision maker | See the ROI story; decide to fund/adopt |
| **Alef tech team** | Future build/integration partner | A clear spec and a working reference to build or extend from |

---

## 6. Scope

### 6.1 In scope (POC — Phase 1)
- Broker PWA: onboarding (dummy account), home, Academy, Projects, branded
  brochure share, booking, activity dashboard, Ask Alef AI assistant.
- Admin Console: overview/metrics, brokers roster, project authoring, academy
  authoring, campaign authoring, push-notification composer.
- A real database (Supabase) so admin-authored content persists and surfaces
  in the broker app.
- AI assistant grounded in 3–4 Alef project brochures.
- Deployed, shareable, installable as a PWA.

### 6.2 Out of scope (POC) — see PRD Phase 2+
- Real broker authentication / RERA verification.
- Real device push notifications (Phase 1 uses an in-app notification feed).
- CRM integration (Alef's CRM), payment flows, contracts.
- Native iOS/Android apps.
- Multi-language (Arabic UI) — brand supports it; not built in POC.
- Real video hosting pipeline at scale.

---

## 7. Commercial context

- The POC itself is an **entry ticket** — delivered at low or no cost to prove
  the concept.
- The real production system (CRM-integrated, scaled, supported) is scoped and
  priced **after** the CEO is convinced — via a paid discovery phase.
- Samir's preferred positioning: not just "the idea person" but part of the
  solution — either building it, or providing architecture + guiding Alef's
  tech team for a fee. The POC must protect this by being impressive enough
  that Alef wants Samir involved, not just the concept.

---

## 8. Constraints & assumptions

- **Timeline:** POC built in a very short window (days). Phasing must respect this.
- **Build method:** Built primarily via Claude Code (agentic coding), not
  hand-coding. Documentation and tracking discipline matters more than usual.
- **Brand:** Must follow the official Alef brand guidelines (navy `#333F48`,
  copper `#B6735C`, beige `#F1ECD6`; Helvetica Neue / GE SS Two type).
- **Assets:** Project brochures and images sourced from Alef (via contact) or
  the public Alef website.
- **Data:** All broker/engagement data in the POC is **sample/seed data** — it
  is illustrative, clearly labelled as a demo workspace.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| Alef builds it internally, Samir gets no ROI | Position Samir as architecture + execution partner; charge a discovery fee |
| Brochure/asset delivery delayed | Fall back to public website assets |
| Scope creep blows the timeline | Strict Phase 1 / Phase 2 split; Phase 2 features are explicitly deferred |
| AI assistant gives wrong/unbounded answers | Tight system prompt; restrict to indexed Alef projects only |
| Demo fails live | Pre-seed a dummy account; rehearse; deploy early and test the link |

---

## 10. Related documents

- **PRD.md** — full product spec, data model, screen-by-screen build, phases.
- **PROJECT_PLAN.md** — phased plan with checkboxes; updated after each step.
- **WORKLOG.md** — append-only log of everything Claude Code does.
- **CLAUDE.md** — standing instructions for Claude Code (read every session).

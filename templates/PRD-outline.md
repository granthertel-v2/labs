# PRD Outline

Source: Kellogg PM101 "PRD Deliverable Outline" template. Use this once the MRD's Go/No-Go call is yes — this is about *how* to build it, not whether to.

## Sections

1. **Vision** — same positioning statement as the MRD (carry it forward, don't redo it).
2. **Motivation** — copy from the MRD (personas, unmet needs, existing solutions, differentiation, why now), marking anything new since the MRD.
3. **Key Path Scenarios** — the MRD's "use scenarios" made concrete: task-oriented (not goal-oriented), interface-specific (mobile app? responsive web? desktop?), interspersed with wireframes/mocks. Unlike MRD scenarios, these *do* depict the actual UI and should be compatible with the real technology choice. Include server-side behavior where relevant ("after user clicks Buy, server checks..."). Cover both sides of a two-sided product, and admin-facing scenarios if applicable.
4. **Detailed Design & Features**
   - **Design Principles** — the tradeoffs you'll hold to (e.g., "we omit incremental features to preserve ease of use," "we preserve backward compatibility"). Cite products whose design you're consciously emulating.
   - **Information Architecture** — model/view/controller table: key data tables, the display views built on them, the logic/algorithms connecting them.
   - **Features** — table: feature name, description, dependencies, priority (v1 / vNext / vLongterm).
5. **Roadmap**
   - **v1 / MVP** — the minimum that ships.
   - **vNext** — the next version's functionality.
   - **vLongterm** — the mature product's functionality (can be just a placeholder bullet list).
6. **Milestones / Timing** — release timing, major milestones (internal demo, beta, full launch), natural reassessment points. Go-to-market plan: which channels, in what sequence.
7. **Metrics** — the metrics that define success, how they're computed (log data, etc.), and expected values at X days/months out.
8. **Projected Costs**
   - **Engineering** — engineer-weeks required, storage/compute cost estimates.
   - **Marketing/other** — launch and marketing spend.
   - **Operational Needs** — ongoing support required, and how it'll be provided.
9. **Risks** — carry forward from the MRD plus anything new since. Table: risk, description, mitigant.
10. **International** — Unicode/localization/translation concerns, if relevant. Skip if not.
11. **Group Members** — contributors beyond the core team, with roles.

## Right-sizing for smaller projects

Full PRD is for something meant to actually ship to real users with real stakes. For a toy project, trim to: **Vision, Key Path Scenarios, Features (v1 only), Milestones/Timing, Risks** — skip cost projections, go-to-market, and internationalization unless the project has genuinely grown into something warranting them.

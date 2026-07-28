# Working cookbook

Frameworks Grant and Claude use for structuring deeper work together, so both start from the same shared reference instead of re-deriving process on every project.

## When to reach for which framework

| Situation | Approach |
|---|---|
| Quick task or question | No framework — just answer or do it. |
| A recurring documentation/writing task (reports, comms, reviews, briefs) | Use the 5C Loop below. |
| A build with real scope (new project, meant to last, multi-session) | Propose a lightweight plan, get sign-off, then build in one shot. |
| Deep research/analysis (career strategy, market analysis, synthesis) | Use the Context / Instruction / Input / Output framework below. |
| A product or feature decision meant to drive a real build | Draft a PRD/MRD together *before* writing code. |

Claude should prompt toward the right-hand column proactively once a request crosses into one of the deeper rows, rather than waiting to be asked.

## The 5C Loop (recurring documentation work)

Source: [claudecodeguide.dev](https://claudecodeguide.dev/docs/frameworks/5c-loop) — for tasks that recur (reports, SOPs, stakeholder updates, PRDs, reviews), where the win comes from building a reusable system rather than solving the task once.

- **Capture** — raw source material (full docs, actual messages, real notes), not summaries. What Claude works from should be complete, not pre-condensed by you.
- **Context** — who reads this, what they already know, what they need to do next, and the format/length that fits them. (Engineering leads ask "is this buildable, in what order?"; a VP asks "why does this matter, why now?" — same source material, different Context block.)
- **Create** — let Claude produce a full draft before editing it. Review after, don't direct mid-draft.
- **Check** — verify the things only you can: factual accuracy, political/stakeholder sensitivity, whether the ask or recommendation is actually explicit. Accountability stays yours regardless of who drafted it.
- **Compound** — save the Context block and the prompt as a reusable template for next time. This is the step that turns a 45-minute first attempt into an 8-minute tenth attempt.

Two domain-specific versions worth knowing, since both map onto real recurring work Grant does:

- **[For Operations](https://claudecodeguide.dev/docs/frameworks/for-operations)** — exception reports, SOPs, vendor escalation emails, monthly operational reviews, budget variance narratives, post-incident reports. Directly applicable to Cedar PS&O work.
- **[For PMs](https://claudecodeguide.dev/docs/frameworks/for-pms)** — PRDs, roadmap narratives, executive one-pagers, stakeholder updates, OKR narratives, GTM briefs. Applicable to both Cedar PS&O and side projects (Composer, labs entries).

Each source page has 8 ready-to-use template prompts (Capture/Context/Create structure) for specific document types — worth pulling the actual template from the source page when a matching recurring task comes up, rather than reconstructing it from this summary.

**How this differs from the pipeline below**: the 5C Loop is for *repeatable production* of a known document type (write this month's variance narrative). The Pain-Point→MRD→PRD pipeline is for *scoping something new* (should this exist, and if so what is it). Different problem, both useful.

## Context / Instruction / Input / Output framework

For deep research or analysis tasks — anything where the value is in a structured synthesis, not a quick answer.

- **Context** — who you're asking Claude to be, and the background it needs (your situation, prior work, constraints).
- **Instruction** — the core task, plus the specific sub-questions the analysis must cover.
- **Input** — what source material is provided, or "standalone, no external input."
- **Output** — the form the answer should take: sections, briefing format, specific deliverables.

### Worked example (career strategy, 2026-07-27)

```
Context: You are a career coach who is specialized in developing your clients into
world-class operations experts at tech companies and tech startups. As your client,
I'm seeking to understand what skills I can develop to become a general manager to
attain COO experience. I have provided you my MBA coursework to help you understand
what my current background is, and to help you understand what gaps I might have.
I currently work as a technical account manager in healthtech (Cedar, Moxe Health,
and Epic Systems are in my work history). I will pivot to a role as a Strategist in
Cedar's Product Strategy and Operations department, and I'm looking to use that
experience as a jumping off point to put myself on a "COO Track". I currently live
and work in NYC.

Instruction: Conduct an in-depth review and synthesis of what skills, experiences,
and industries would be a good fit for me to become a tech COO in technology in the
next 10 years. Your focus should include, but is not limited to:
  - What experiences do companies look for?
  - How are COOs hired? What do their career tracks typically look like?
  - What is disqualifying for a tech COO? What are unexpected benefits?
  - What are required skills? Helpful skills? Anti-patterns?
  - What can be taught and what has to be learned on the job?

Input: This is a standalone task. No external input will be provided.

Output: Deliver a detailed briefing report that includes:
  - An analysis of my current studies and where there are gaps
  - An analysis of my work history, skills, and where there are gaps
  - Summary of what future tech COOs will need and what skills to work towards, and why
  - A description of an obtainable career path and a timeframe to achieve it
  - Any other suggestions a career coach would make to enable success
```

## Building something new: the full pipeline

Sourced from Kellogg coursework (Product Management, New Venture Discovery), not invented — in order:

### 1. Pain Point Statement

Before an MRD, before a vision — the raw discovery step. Three questions, answered plainly:

- What problem/pain are you interested in solving?
- Whose problem is it?
- Why does the problem interest you personally?

This is upstream of everything else. If we can't answer these three cleanly, we're not ready to draft an MRD yet.

### 2. MRD

Source: Kellogg PM101 template, full outline at [`templates/MRD-outline.md`](./templates/MRD-outline.md). Is this problem and market worth solving? Ends in an explicit Go/No-Go call.

**Caveat worth remembering:** MRD authors are structurally biased toward recommending "yes" — by the time you've written one, you've already sunk effort into believing in it. The Go/No-Go call benefits from outside scrutiny (me pushing back, or you re-reading it a day later), not just self-review. Treat "kill your darlings" as a real option, not a formality.

### 3. Choosing among several candidate ideas (if there's more than one MRD-worthy option)

Two distinct methods, best used together:

- **Criteria-based screening** — evaluate against explicit standards (market size, strategic fit, feasibility). 3M's *Real–Win–Worth-it* is a clean version: is it a real market/product? can we win it? is it worth it financially? Consistent and transparent, but favors safe, incremental ideas.
- **Multi-voting** — aggregate gut-level enthusiasm (e.g., each of us "votes" for favorites without pre-defined criteria). Faster, better at surfacing unconventional ideas, but less explicit about the reasoning.
- **Recommended default**: criteria first to ground the discussion, then multi-vote to capture what criteria alone would miss. This is close to what we actually did narrowing down the SaaS ideas earlier — worth using more deliberately next time.

### 4. MVP Smoke Test (before writing a real PRD)

Validate demand before building anything real: ship a single fake-door landing page (not a working product) that communicates the value proposition, and track specific behavioral signals — clicks on the key call-to-action, searches performed, attempted bookings/sign-ups. Only move to a full PRD if the smoke test shows real signal. This fits directly into the "toy projects as reps" approach — cheap to build, honest about what it is, and it's how Grant validated a prior idea (a Lovable-generated landing page) before committing further.

### 5. PRD

Source: Kellogg PM101 template, full outline at [`templates/PRD-outline.md`](./templates/PRD-outline.md), only after a Go. Key path scenarios, features, roadmap (v1/vNext/vLongterm), metrics, risks.

**Filling in "Metrics"**: use Google's **HEART framework** — Happiness, Engagement, Adoption, Retention, Task Success — rather than leaving it vague. Each category gets a Goal, Signals, and Metrics. Pick one North Star metric that the others support.

**Right-size by stakes**: a real product/business idea gets the full outline (MRD and PRD both); a toy/labs project gets the trimmed version noted at the bottom of each template file — roughly Pain Point + Vision + Unmet Needs + Key Path Scenarios + v1 Features + Risks, skipping market sizing, cost projections, and go-to-market.

**Worked example**: [`templates/PRD-worked-example.md`](./templates/PRD-worked-example.md) — a trimmed excerpt from Grant's real Composer PRD, showing what a filled-in PRD (including the HEART framework in practice) actually looks like. Specific financial projections are kept private; this shows structure and substance without the real numbers.

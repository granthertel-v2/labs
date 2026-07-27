# Working cookbook

Frameworks Grant and Claude use for structuring deeper work together, so both start from the same shared reference instead of re-deriving process on every project.

## When to reach for which framework

| Situation | Approach |
|---|---|
| Quick task or question | No framework — just answer or do it. |
| A build with real scope (new project, meant to last, multi-session) | Propose a lightweight plan, get sign-off, then build in one shot. |
| Deep research/analysis (career strategy, market analysis, synthesis) | Use the Context / Instruction / Input / Output framework below. |
| A product or feature decision meant to drive a real build | Draft a PRD/MRD together *before* writing code. |

Claude should prompt toward the right-hand column proactively once a request crosses into one of the deeper rows, rather than waiting to be asked.

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

## PRD/MRD skeleton

Lightweight default — expand as the project warrants:

- **Problem** — what's broken or missing, for whom
- **Goals / non-goals** — what this explicitly is and isn't trying to do
- **Users** — who this is for, and what they need from it
- **Requirements** — the must-haves, in priority order
- **Success metrics** — how we'll know it worked
- **Open questions** — what's still undecided and needs a call before or during the build

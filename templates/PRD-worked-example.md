# Worked Example: Composer PRD (trimmed)

Adapted from Grant's real PRD for Composer, his meal-planning app side project. Specific financial figures, exact dates, and detailed cost/revenue modeling have been removed or generalized — this excerpt exists to show what a *filled-in* PRD looks like, not to publish private business planning. The full document (with engineering/infrastructure cost estimates and revenue projections) stays private.

## Vision

> Every week, busy professionals face the same small but frustrating question: "What should we cook this week?" Despite the explosion of recipe websites and cooking apps, deciding what to cook remains surprisingly difficult... Composer is designed to remove the friction from this decision. Instead of helping users simply find recipes, Composer helps them plan their cooking week, generating smart meal suggestions that reuse ingredients, respect preferences, and fit into real schedules.
>
> **Product Hypothesis:** reducing the cognitive burden of weekly meal planning will meaningfully increase how often busy professionals cook at home.

## Persona (one of two)

**Paul — the Pragmatic Weeknight Planner**
- Early-30s urban professional, demanding full-time job, values efficiency over cooking-as-hobby
- Shops once a week, reuses a small set of familiar meals due to planning fatigue, defaults to takeout when planning feels too time-consuming
- **Implication for the product:** must reduce decision fatigue rather than increase choice; must support flexible planning for one or two people, not families

## Key Path Scenario (one of three)

**Weekly Meal Planning** — Paul opens the app Sunday evening:
1. **View Weekly Calendar** — sees the week's empty slots, prompted to "Generate Meal Plan." Behind the scenes: system pulls his profile, his partner's shared preferences, recent meal history, pantry inventory.
2. **Review Meal Recommendations** — ranked cards (photo, cook time, tags like "Quick & Easy") based on ingredient reuse, dietary fit, and avoidance of recent repeats. Paul selects two meals.
3. **Confirm Weekly Plan** — meals scheduled; a grocery list is auto-generated, grouped by category, with pantry items already excluded.

## Features table (format, trimmed to v1 rows)

| Feature | Description | Priority |
|---|---|---|
| User Onboarding & Preference Setup | Account creation, dietary preferences, household size | v1 |
| Weekly Meal Plan Generator | Core feature: generates a plan from preferences, past recipes, ingredient reuse | v1 |
| Grocery List Generator | Auto-compiles ingredients from selected recipes, grouped by category | v1 |
| Midweek Plan Adjustment | Replace a planned meal if an ingredient's missing | vNext |
| Camera-Based Pantry Detection | Scan fridge/pantry to auto-update inventory | vLongterm |

## Metrics: the HEART framework, applied

Google's HEART framework (Happiness, Engagement, Adoption, Retention, Task Success) is what actually fills in a PRD's otherwise-vague "Metrics" section. Each category gets a Goal, Signals, and Metrics:

| Category | Goal | Example metric |
|---|---|---|
| **H**appiness | Users feel Composer reduces decision fatigue | Recipe rating score; periodic "did this make planning easier?" survey |
| **E**ngagement | Users actively use the planning tools weekly | Weekly Active Planners (the North Star metric); meal plan generation frequency |
| **A**doption | New users reach the core value quickly | Activation rate: % generating a first plan within 7 days |
| **R**etention | Usage becomes a recurring habit, not one-time | Weekly retention rate: % planning in consecutive weeks |
| **T**ask Success | Users complete the actual workflow | Meal plan completion rate: meals cooked ÷ meals scheduled |

North Star metric for Composer: **Weekly Active Planners** — everything else is a supporting signal for whether that's growing.

## What's trimmed from the real document

The full PRD also includes: detailed engineering/infrastructure/marketing cost estimates, a month-by-month milestone timeline, a proposed pricing model, and break-even subscriber math. Kept private — this excerpt is here to show structure and the HEART framework in action, not Grant's actual business numbers.

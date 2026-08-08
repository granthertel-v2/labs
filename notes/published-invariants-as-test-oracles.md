# Learning: when a simulation has published invariants, a failing test is three-way ambiguous — engine, expectation, or a deliberate design divergence

**From:** `life` (2026-08-07) — see [`life/index.html`](../life/index.html)

## The problem

"Does this simulation work?" has no obvious answer by inspection. A Game of Life board that is subtly wrong — an off-by-one in neighbour counting, a broken edge wrap — still produces plausible-looking churn. Watching it is not evidence.

Life is unusual in that decades of published work supply exact numbers. The R-pentomino settles at generation 1,103 with 116 cells. The Gosper glider gun emits its first glider at generation 15 and one every 30 thereafter. Diehard reaches population 0 at exactly generation 130. The pulsar has period 3, the pentadecathlon period 15, a glider translates exactly (+1,+1) every 4 generations.

Those are test oracles. An engine that hits all of them is not plausibly wrong.

## Fix

Two things made the oracle worth trusting.

**Parse the pattern data out of the shipped file rather than retyping it.** The point of the test is to validate what ships. A copy of the glider in the test file validates the copy.

```js
const SRC = fs.readFileSync('…/life/index.html', 'utf8');
const m = /const PATTERNS = (\{[\s\S]*?\n  \});/.exec(SRC);
const PATTERNS = eval('(' + m[1] + ')');
```

Storing the patterns as plain ASCII arrays (`glider: ['.O.','..O','OOO']`) — chosen for source readability — is what makes this a three-line extraction instead of a parser.

**Assert on the published number, not on "it changed."** `population === 0 at generation 130` either holds or it doesn't. 30 such assertions ran green and made the naive typed-array engine trustworthy without any comparison implementation.

## The actual lesson: reading the failures

Two of the first assertions failed, and neither was an engine bug. That is the part worth remembering, because the instinct on a red test is to go change the implementation.

**One expectation was simply arbitrary.** I asserted Seeds (B2/S) grows after a *single* step; it produces exactly 5 cells there. Seeds is explosive over twenty generations, not one. The assertion encoded nothing real — I had picked a horizon without thinking about it.

**One encoded an assumption the implementation deliberately broke.** The acorn's textbook "633 cells at generation 5,206" is an *infinite-plane* figure. This grid is a torus, chosen deliberately so gliders wrap instead of dying at the edge. Over 5,206 generations the acorn's escaped gliders travel ~1,300 cells, lap a 600-wide torus twice, and crash back into the debris they came from. The engine was right; the published number silently assumed a topology the design had rejected on purpose.

The R-pentomino passing at exactly 1,103/116 is what proves this. In 1,103 generations a glider travels ~275 cells — inside the 300-cell half-width, so nothing wraps, and the infinite-plane figure still holds. Same engine, same oracle, different answer purely because of how far the escapees got.

So the fix was to test the acorn inside a wrap-free window (1,500 generations on a 1,000-wide grid) and assert methuselah *behavior* — grows from 7 cells past 300, still changing at the end — rather than a number the topology can't reach. And the divergence went into a source comment, so it reads as topology rather than as a bug:

> the R-pentomino still hits 1103 on a large grid, but the acorn's gliders lap the board long before gen 5206 and the numbers drift. That divergence is the topology, not a bug.

## When this applies

- Any simulation with a literature: cellular automata, physics integrators, well-known algorithms, reference datasets. Look for published exact values before writing a single hand-rolled expectation.
- Before changing code on a red invariant test, classify the failure: engine bug, arbitrary expectation, or a real consequence of a deliberate design choice. Only the first is a code fix. The third is a documentation obligation — an undocumented deliberate divergence will be "fixed" by someone later, including you.
- Published figures carry unstated preconditions (here, an unbounded plane). Check whether your implementation honors them before treating the number as ground truth.
- Where a constraint makes an exact figure unreachable, assert the qualitative property instead — but pick the horizon deliberately, or you get the Seeds mistake.

Related: [`driving-browser-toys-with-raw-cdp.md`](./driving-browser-toys-with-raw-cdp.md), on how to run these against the real page.

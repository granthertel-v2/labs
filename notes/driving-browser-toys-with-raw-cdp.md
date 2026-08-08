# Learning: a no-framework browser toy can be driven and asserted on with ~40 lines of raw CDP

**From:** `life` (2026-08-07) — see [`life/index.html`](../life/index.html)

## The problem

The labs toys are single self-contained `index.html` files with no build step, no package.json, and no test runner. The default way to check one is to open it and look at it. That catches rendering, and misses everything that only happens on interaction — which for `life` was most of the surface: drag-to-draw, stamp placement, rotation, rule switching, resize.

Installing Playwright or Puppeteer to test a 600-line static file inverts the dependency ratio the toys exist to avoid.

## Fix

Chrome is already on the machine. Spawn it headless with a debug port and talk to it over the DevTools Protocol WebSocket directly — the only dependency is `ws`, and everything needed is `Runtime.evaluate` plus two subscriptions.

```js
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--remote-debugging-port=9333', '--window-size=1280,800',
   '--no-first-run', '--user-data-dir=./cprof', 'about:blank'], { stdio: 'ignore' });

// GET /json/list -> pick the page target -> connect to its webSocketDebuggerUrl
const send = (method, params = {}) =>
  new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

await send('Runtime.enable');   // then collect Runtime.exceptionThrown + Runtime.consoleAPICalled
await send('Page.navigate', { url: 'file:///…/index.html' });
```

Because the toys keep their controls as plain module-scope `const`s bound to DOM ids, `Runtime.evaluate` reaches everything without any test hooks in the shipped file:

```js
await ev(`sStamp.value='gosper'; sStamp.dispatchEvent(new Event('change'));`);
await ev(`c.dispatchEvent(new PointerEvent('pointerdown',{clientX:400,clientY:350,bubbles:true,pointerId:1}))`);
await ev(`for (let i=0;i<300;i++) bStep.click();`);
console.log(await ev(`stPop.textContent`));   // 86 -- the Gosper gun's exact population at gen 300
```

Three CDP methods beyond that covered the rest: `Page.captureScreenshot` for visual review, `Emulation.setEmulatedMedia` to verify the `prefers-reduced-motion` path without touching OS settings, and `Emulation.setDeviceMetricsOverride` to check the control panel scrolls internally on a short viewport instead of overflowing the page.

## What it actually caught

Worth separating by detection method, because the split was instructive:

**Assertions caught what I thought to check.** Changing cell size truncated the board from the top-left corner rather than holding the center — a genuine user-facing bug, since an accidental window resize silently ate your pattern. Only visible because the test asserted population *across* a resize rather than after a fresh load.

**Exception capture caught what I didn't.** An unguarded `canvas.setPointerCapture(e.pointerId)` sat on the first line of the `pointerdown` handler, upstream of all the drawing. Synthetic pointer events made it throw, which took the entire handler down with it. The synthetic-event trigger is a test artifact — a real pointer wouldn't throw — but the structural problem is real and worth the guard: a convenience call for drag-tracking had become a hard prerequisite for drawing at all. `try { … } catch (_) {}` and drawing no longer depends on it.

**Screenshots caught what no assertion would have.** Adding italic rule descriptions blew the control panel from 268px to 760px wide, swallowing a third of the canvas — the panel is `position: fixed` and shrink-to-fit, so the longest sentence was setting its width. Every functional assertion still passed. Once seen, it converts into an assertion worth keeping (`distinct panel widths across all presets === 1`), but nothing in the existing suite would have found it.

## When this applies

- Any static HTML artifact where the interesting behavior is behind interaction and adding a test framework would outweigh the thing being tested. Applies to `ripple` as much as `life`.
- The CDP harness is the reusable part; keep it in the scratchpad, not the repo, so the toy stays a single dependency-free file.
- Keep all three checks, not just assertions. They fail on disjoint classes of bug, and the screenshot pass is the only one that catches "still correct, now ugly."
- Corollary for the toys themselves: exposing controls as module-scope consts bound to DOM ids — already the house pattern for its own readability reasons — is what makes them drivable with zero test scaffolding in the shipped file. Worth not giving up.

Related: [`published-invariants-as-test-oracles.md`](./published-invariants-as-test-oracles.md), on what to assert once you can drive the thing.

# Learning: mapping continuous data to pitch produces uncontrolled intervals unless you quantize

**From:** `ripple` (2026-07-29) — see [`ripple/index.html`](../ripple/index.html)

## The problem

`ripple`'s ambient drone maps vertical screen position to pitch across 6 horizontal bands, all sustaining simultaneously. The first version computed each band's frequency by straight geometric (log-space) interpolation between a low and high bound — no relationship to any musical scale, just evenly-spaced points in Hz-log-space.

It sounded, unprompted, like it was "in a minor key." It wasn't in any key at all — that was the bug.

## Root cause

Six band frequencies spaced evenly in log-space across a fixed span works out to a fixed number of semitones between *adjacent* bands: `12 * span_octaves / (band_count - 1)`. At the shipped default (2.5 octaves, 6 bands), that's `12 * 2.5 / 5 = 6` semitones — a tritone, the most dissonant interval in Western music — between every adjacent pair, all ringing at once through a reverb send. Nothing chose that interval; it fell out of doing continuous math on something people hear discretely.

This generalizes: **any time multiple continuously-interpolated frequencies will sound together** (not sequentially), the interval spacing is arbitrary unless you deliberately constrain it. Interpolating smoothly is the wrong instinct — pitch perception is categorical, not continuous, the moment more than one note is sounding.

## Fix

Quantize to real scale degrees instead of raw interpolation. Build a wide multi-octave note list from scale degrees (semitones from root) rooted at a center frequency, filter to the desired [low, high] window, then pick evenly-indexed notes from that filtered list — so the window/range slider still works, but every selected frequency is a real scale member.

```js
const SCALES = {
  pentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
};

function buildScaleNoteList(rootHz, degrees) {
  const notes = [];
  for (let oct = -5; oct <= 5; oct++) {
    for (const deg of degrees) notes.push(rootHz * Math.pow(2, oct + deg / 12));
  }
  return notes.sort((a, b) => a - b);
}
```
See [`ripple/index.html:380-418`](../ripple/index.html) (`SCALES`, `buildScaleNoteList`, `computeBandFreqs`) for the full windowing/selection logic, including the raw-interpolation "Free" mode kept as an explicit, opt-in option rather than removed.

## When this applies

- Sonifying any continuous value (position, sensor data, price, whatever) where more than one mapped value can be audible at the same time.
- Does *not* apply to single-voice/sequential sonification (one note at a time) — dissonant intervals only matter when things overlap.
- The fix pattern (build a wide scale-degree note list, filter to a window, index-select) is reusable for any "N simultaneous voices mapped from continuous data, want them to stay consonant" problem, independent of the specific scale chosen.

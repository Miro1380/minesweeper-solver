// TODO: import { useState, useEffect } from 'react'

/**
 * TODO: Return milliseconds elapsed while `running` is true. `resetKey` is
 * any value that changes when the clock should restart from zero (e.g. a
 * "game number" you bump on every "New Game" click).
 *
 * Hints:
 * - The interval/subscription itself is a legitimate `useEffect` — that's
 *   "synchronizing with an external system" (the browser clock).
 * - The *reset*, though, doesn't need an effect. Look up React's "adjusting
 *   state when a prop changes" pattern (react.dev/learn/you-might-not-need-an-effect):
 *   compare the incoming `resetKey` against the previous one you've stored
 *   in state, and if it changed, call your setters directly during render
 *   (not inside a `useEffect`). It's a slightly unusual-looking pattern the
 *   first time you see it — worth understanding *why* it works (React
 *   re-renders immediately with the corrected state before anything commits
 *   to the screen).
 * - Since games here never pause/resume, `running` only ever flips
 *   false→true once per game — you don't need a ref to track "time already
 *   elapsed before a pause."
 */
export function useTimer(running: boolean, resetKey: unknown): number {
  throw new Error('TODO: implement useTimer')
}

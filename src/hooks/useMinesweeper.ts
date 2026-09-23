// TODO: import { useReducer, useState, useCallback, useMemo } from 'react'
// and whatever you need from ../engine/*

/**
 * TODO: Wrap `gameReducer` in a hook that a component can actually use.
 * Should return something like:
 *   { state, newGame, reveal, toggleFlag, elapsedMs, minesRemaining }
 *
 * Hints:
 * - `useReducer(gameReducer, someDifficulty, createInitialState)` — the
 *   third argument is React's "lazy init" form, handy since your init
 *   function takes an argument.
 * - `newGame`, `reveal`, `toggleFlag` are just thin `dispatch` wrappers.
 *   Wrap them in `useCallback` so components that receive them as props
 *   don't re-render unnecessarily.
 * - The reducer's own state doesn't carry a stable "this is a fresh game"
 *   signal — two different empty boards for the same difficulty won't
 *   necessarily be `!==` in a way you can rely on for resetting a timer.
 *   Consider keeping your own small counter, bumped on every `newGame`
 *   call, to hand to `useTimer` as its `resetKey`.
 * - `minesRemaining` and "how many cells are flagged" are derived values —
 *   compute them from `state.board`, memoized with `useMemo`, rather than
 *   storing them as separate state that could drift out of sync.
 */
export function useMinesweeper(initialDifficulty?: string) {
  throw new Error('TODO: implement useMinesweeper')
}

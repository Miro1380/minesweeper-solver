// TODO: import { findHint } from '../engine/solver' and whatever types you need

/**
 * TODO: Run the solver on demand (not after every move — that'd be wasted
 * work for a feature the player only wants occasionally). Should return
 * something like `{ hint, requestHint, clearHint }`.
 *
 * Hints:
 * - `requestHint()` should run `findHint(board)` and store the result.
 * - Any move should invalidate the previous hint — it was computed for a
 *   board that no longer exists. Same "adjust state during render by
 *   comparing to the previous value" pattern as `useTimer`'s reset applies
 *   here too, comparing against the previous `board` reference.
 */
export function useHint(/* board */) {
  throw new Error('TODO: implement useHint')
}

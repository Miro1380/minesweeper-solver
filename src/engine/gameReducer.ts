// TODO: import from ./board and ./types as needed, e.g.:
// import { createEmptyBoard, isBoardCleared, isMineAt, placeMines, revealAllMines, revealCell, toggleFlag } from './board'
// import { DIFFICULTIES, assertNever } from './types'
// import type { Board, Coordinate, Difficulty, GameStatus } from './types'

/**
 * TODO: Define a `GameState` type: at minimum the current `board`, the
 * `status`, and the active `difficulty`.
 */

/**
 * TODO: Define a `GameAction` discriminated union for everything the player
 * can do: starting a new game, revealing a cell, toggling a flag on a cell.
 */

/**
 * TODO: Build the initial state for a given difficulty (an empty board,
 * status "not_started").
 */
export function createInitialState(/* difficulty */) {
  throw new Error('TODO: implement createInitialState')
}

/**
 * TODO: The reducer itself: `(state, action) => nextState`.
 *
 * Hints:
 * - Ignore reveal/flag actions once the game is already won or lost.
 * - On the very first reveal (status "not_started"), that's when mines get
 *   placed (see `placeMines` in board.ts) — not before.
 * - If the revealed cell is a mine: reveal all mines, status becomes "lost".
 * - Otherwise reveal normally, then check whether the board is now fully
 *   cleared to decide between "in_progress" and "won".
 * - Use a `switch` over `action.type` with an `assertNever` default case
 *   for exhaustiveness (see the hint in types.ts).
 */
export function gameReducer(/* state, action */) {
  throw new Error('TODO: implement gameReducer')
}

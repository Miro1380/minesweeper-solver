/**
 * Core domain types for the Minesweeper engine.
 *
 * Zero React/DOM dependencies — plain data and pure functions, so
 * `board.ts` and `solver.ts` can be unit-tested without rendering anything.
 */

/** A validated { row, col } board position. Branded so a plain `{row, col}`
 * literal built elsewhere can't be mistaken for one — always construct via
 * `coordinate()`. */
export type Coordinate = {
  row: number
  col: number
  __brand: 'Coordinate'
}

/** The only way to construct a `Coordinate`. */
export function coordinate(row: number, col: number): Coordinate {
  return { row, col, __brand: 'Coordinate' }
}

/** String form of a `Coordinate`, for use as a Map/Set key. */
export function coordinateKey(c: Coordinate): string {
  return `${c.row},${c.col}`
}

/** One board cell's state. A revealed cell alone carries `adjacentMines`. */
export type Cell =
  | { status: 'hidden' }
  | { status: 'flagged' }
  | {
      status: 'revealed'
      adjacentMines: number
    }

/** The full game board: its dimensions, cell grid, and mine layout.
 * `mines` is `undefined` until the first reveal places them. */
export type Board = {
  width: number
  height: number
  mineCount: number
  cells: Cell[][]
  mines: boolean[][] | undefined
}

/** The game's overall lifecycle state. */
export type GameStatus = 'not_started' | 'in_progress' | 'won' | 'lost'

/** A named board size/mine-count preset. */
export type Difficulty = {
  label: string
  width: number
  height: number
  mineCount: number
}

/** The selectable difficulty presets. */
export const DIFFICULTIES = {
  beginner: {
    label: 'Beginner',
    width: 9,
    height: 9,
    mineCount: 10,
  },
  intermediate: {
    label: 'Intermediate',
    width: 12,
    height: 12,
    mineCount: 15,
  },
  expert: {
    label: 'Expert',
    width: 15,
    height: 15,
    mineCount: 20,
  },
} satisfies Record<string, Difficulty>

/** The solver's conclusion about one cell: safe or a mine, and why. */
export type Deduction = {
  coordinate: Coordinate
  verdict: 'safe' | 'mine'
  reason: string
}

/** Exhaustiveness check: call this in a `switch`'s `default` case. If a
 * union gains a new variant that isn't handled elsewhere in the switch,
 * the call site stops compiling instead of failing silently at runtime. */
export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`)
}

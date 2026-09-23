/**
 * Core domain types for the Minesweeper engine.
 *
 * This module has zero React/DOM dependencies on purpose: everything here is
 * plain data and pure functions, which is what makes `board.ts` and
 * `solver.ts` trivially unit-testable without rendering anything.
 */

/**
 * A row/column pair, branded so it can't be silently swapped for a plain
 * `{ row: number; col: number }` built somewhere else in the code (e.g. a UI
 * event's `{row, col}` that hasn't been validated against the board bounds
 * yet). Use `coordinate()` to construct one.
 */
export interface Coordinate {
  readonly row: number
  readonly col: number
  readonly __brand: 'Coordinate'
}

export function coordinate(row: number, col: number): Coordinate {
  return { row, col, __brand: 'Coordinate' }
}

export function coordinateKey(c: Coordinate): string {
  return `${c.row.toString()},${c.col.toString()}`
}

/** The state of a single cell, modeled so illegal combinations don't type-check. */
export type Cell =
  | { readonly status: 'hidden' }
  | { readonly status: 'flagged' }
  | { readonly status: 'revealed'; readonly adjacentMines: number }

/** Where a cell's mine actually is — kept separate from `Cell` so revealing a
 * cell never has to "forget" whether it was a mine; the two grids are parallel. */
export type MineLayout = readonly (readonly boolean[])[]

export interface Board {
  readonly width: number
  readonly height: number
  readonly mineCount: number
  readonly cells: readonly (readonly Cell[])[]
  /**
   * `undefined` until the first reveal, since mine placement is deferred
   * until the player's first click so that click can never be a mine.
   */
  readonly mines: MineLayout | undefined
}

export type GameStatus = 'not_started' | 'in_progress' | 'won' | 'lost'

export interface Difficulty {
  readonly label: string
  readonly width: number
  readonly height: number
  readonly mineCount: number
}

export const DIFFICULTIES = {
  beginner: { label: 'Beginner', width: 9, height: 9, mineCount: 10 },
  intermediate: { label: 'Intermediate', width: 16, height: 16, mineCount: 40 },
  expert: { label: 'Expert', width: 30, height: 16, mineCount: 99 },
} as const satisfies Record<string, Difficulty>

export type DifficultyKey = keyof typeof DIFFICULTIES

/** A solver's conclusion about one hidden/flagged cell, and why. */
export interface Deduction {
  readonly coord: Coordinate
  readonly verdict: 'safe' | 'mine'
  readonly reason: string
}

/**
 * Exhaustiveness helper: call this in the `default` branch of a `switch`
 * over a union. If a new variant is added to the union later and that
 * switch isn't updated, `x` won't be typed `never` anymore and this call
 * fails to compile — turning a missed case into a build error instead of a
 * runtime bug.
 */
export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`)
}

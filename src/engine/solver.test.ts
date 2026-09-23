import { describe, expect, it } from 'vitest'
import { findHint, solve } from './solver'
import type { Board, Cell } from './types'

const hidden: Cell = { status: 'hidden' }
const flagged: Cell = { status: 'flagged' }
const revealed = (adjacentMines: number): Cell => ({ status: 'revealed', adjacentMines })

/** The solver only ever reads `cells` (never `mines`), so tests build a
 * board's cell grid directly instead of playing out a real game. */
function makeBoard(cells: readonly (readonly Cell[])[], mineCount = 0): Board {
  const height = cells.length
  const width = cells[0]?.length ?? 0
  return { width, height, mineCount, cells, mines: undefined }
}

describe('solve — single-point rule', () => {
  it('marks hidden neighbors safe when flagged mines already cover the clue', () => {
    // flagged, "1", hidden — the flag already accounts for the 1 mine.
    const board = makeBoard([[flagged, revealed(1), hidden]])
    const deductions = solve(board)
    expect(deductions).toContainEqual(
      expect.objectContaining({
        coord: { row: 0, col: 2, __brand: 'Coordinate' },
        verdict: 'safe',
      }),
    )
    expect(deductions[0]?.reason.length).toBeGreaterThan(0)
  })

  it('marks all hidden neighbors as mines when the count matches exactly', () => {
    // "2" sitting between two hidden cells, its only two neighbors: both must be mines.
    const board = makeBoard([[hidden, revealed(2), hidden]])
    const deductions = solve(board)
    const verdicts = new Map(
      deductions.map((d) => [`${d.coord.row.toString()},${d.coord.col.toString()}`, d.verdict]),
    )
    expect(verdicts.get('0,0')).toBe('mine')
    expect(verdicts.get('0,2')).toBe('mine')
  })

  it('makes no deduction when a clue is ambiguous on its own', () => {
    // "1" between two hidden cells: could be either one, no flags to help.
    const board = makeBoard([[hidden, revealed(1), hidden]])
    expect(solve(board)).toEqual([])
  })
})

describe('solve — subset rule', () => {
  it('deduces the non-overlapping cell from two overlapping clues', () => {
    // Row 0: three hidden cells X0 X1 X2
    // Row 1: "1" (neighbors X0,X1) | "2" (neighbors X0,X1,X2) | "0" filler
    //
    // "1" says exactly 1 mine among {X0,X1}. "2" says exactly 2 mines among
    // {X0,X1,X2}. Subtracting: the extra cell X2 alone must hold the extra
    // 1 mine — a deduction the single-point rule can't make on its own.
    const board = makeBoard([
      [hidden, hidden, hidden],
      [revealed(1), revealed(2), revealed(0)],
    ])

    const deductions = solve(board)
    expect(deductions).toContainEqual(
      expect.objectContaining({
        coord: { row: 0, col: 2, __brand: 'Coordinate' },
        verdict: 'mine',
      }),
    )
    // X0 and X1 individually remain ambiguous (1 mine shared between them).
    expect(deductions.some((d) => d.coord.row === 0 && d.coord.col === 0)).toBe(false)
    expect(deductions.some((d) => d.coord.row === 0 && d.coord.col === 1)).toBe(false)
  })
})

describe('findHint', () => {
  it('prefers a safe deduction over a mine deduction when both exist', () => {
    // A single row means every cell's only neighbors are its immediate
    // left/right, so a revealed(0) filler cell fully isolates the two
    // clues from each other: idx2 deduces idx3 safe, idx6 deduces
    // idx5 and idx7 as mines, independently.
    const board = makeBoard([
      [hidden, flagged, revealed(1), hidden, revealed(0), hidden, revealed(2), hidden],
    ])
    const hint = findHint(board)
    expect(hint?.verdict).toBe('safe')
    expect(hint?.coord).toEqual({ row: 0, col: 3, __brand: 'Coordinate' })
  })

  it('returns undefined when nothing is provable', () => {
    const board = makeBoard([[hidden, revealed(1), hidden]])
    expect(findHint(board)).toBeUndefined()
  })
})

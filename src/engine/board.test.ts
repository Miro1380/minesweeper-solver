import { describe, expect, it } from 'vitest'
import {
  countFlaggedCells,
  createEmptyBoard,
  isBoardCleared,
  neighborsOf,
  placeMines,
  revealCell,
  toggleFlag,
} from './board'
import { type Board, type Cell, coordinate } from './types'

describe('createEmptyBoard', () => {
  it('builds a grid of the requested size, all hidden, no mines placed yet', () => {
    const board = createEmptyBoard(4, 3, 5)
    expect(board.width).toBe(4)
    expect(board.height).toBe(3)
    expect(board.cells).toHaveLength(3)
    expect(board.cells[0]).toHaveLength(4)
    expect(board.mines).toBeUndefined()
    for (const row of board.cells) {
      for (const cell of row) {
        expect(cell.status).toBe('hidden')
      }
    }
  })
})

describe('neighborsOf', () => {
  it('returns all 8 neighbors for an interior cell', () => {
    const board = createEmptyBoard(5, 5, 0)
    expect(neighborsOf(board, coordinate(2, 2))).toHaveLength(8)
  })

  it('returns only 3 neighbors for a corner cell', () => {
    const board = createEmptyBoard(5, 5, 0)
    expect(neighborsOf(board, coordinate(0, 0))).toHaveLength(3)
  })

  it('returns only 5 neighbors for an edge cell', () => {
    const board = createEmptyBoard(5, 5, 0)
    expect(neighborsOf(board, coordinate(0, 2))).toHaveLength(5)
  })
})

describe('placeMines', () => {
  it('places exactly mineCount mines, never on the first click or its neighbors', () => {
    const board = createEmptyBoard(5, 5, 5)
    const firstClick = coordinate(2, 2)
    const placed = placeMines(board, firstClick)

    expect(placed.mines).toBeDefined()
    const mines = placed.mines
    if (!mines) throw new Error('expected mines to be placed')

    let mineTotal = 0
    for (let row = 0; row < placed.height; row++) {
      for (let col = 0; col < placed.width; col++) {
        if (mines[row]?.[col]) mineTotal++
      }
    }
    expect(mineTotal).toBe(5)

    const forbidden = [coordinate(2, 2), ...neighborsOf(board, firstClick)]
    for (const c of forbidden) {
      expect(mines[c.row]?.[c.col]).toBe(false)
    }
  })

  it('still places every mine on a board too small to exclude the whole first-click neighborhood', () => {
    // 1x3 row, 1 mine: excluding (0,0) and its only neighbor (0,1) leaves
    // just one free cell. The mine count invariant must still hold instead
    // of silently placing 0 mines.
    const board = createEmptyBoard(3, 1, 1)
    const placed = placeMines(board, coordinate(0, 0))
    const mines = placed.mines
    if (!mines) throw new Error('expected mines to be placed')

    expect(mines[0]?.[0]).toBe(false) // the clicked cell is always spared
    const total = mines[0]?.filter(Boolean).length ?? 0
    expect(total).toBe(1)
  })
})

/** Builds a board with a hand-picked mine layout, bypassing random placement,
 * so cascade behavior can be asserted deterministically. */
function boardWithMines(
  width: number,
  height: number,
  mineCoords: readonly [number, number][],
): Board {
  const empty = createEmptyBoard(width, height, mineCoords.length)
  const mines = Array.from({ length: height }, () => Array.from({ length: width }, () => false))
  for (const [row, col] of mineCoords) {
    const mineRow = mines[row]
    if (mineRow) mineRow[col] = true
  }
  return { ...empty, mines }
}

describe('revealCell', () => {
  it('cascades through zero-adjacent cells and stops at numbered borders', () => {
    // 3x3 board, single mine at the corner (0,0). Revealing the far corner
    // should flood-fill the entire rest of the board, since a 0-adjacent
    // cell can never border a mine by definition.
    const board = boardWithMines(3, 3, [[0, 0]])
    const revealed = revealCell(board, coordinate(2, 2))

    const status = (row: number, col: number): Cell['status'] | undefined =>
      revealed.cells[row]?.[col]?.status
    expect(status(0, 0)).toBe('hidden') // the mine itself: never swept in
    expect(status(0, 1)).toBe('revealed')
    expect(status(1, 1)).toBe('revealed')
    expect(status(2, 2)).toBe('revealed')
    expect(isBoardCleared(revealed)).toBe(true)
  })

  it('reveals only the single cell when it has adjacent mines', () => {
    const board = boardWithMines(3, 3, [[0, 0]])
    const revealed = revealCell(board, coordinate(0, 1))
    expect(revealed.cells[0]?.[1]).toEqual({ status: 'revealed', adjacentMines: 1 })
    expect(revealed.cells[2]?.[2]?.status).toBe('hidden')
  })

  it('does nothing before mines have been placed', () => {
    const board = createEmptyBoard(3, 3, 1)
    const revealed = revealCell(board, coordinate(1, 1))
    expect(revealed).toBe(board)
  })
})

describe('toggleFlag', () => {
  it('flags a hidden cell and unflags it back', () => {
    const board = boardWithMines(3, 3, [[0, 0]])
    const flagged = toggleFlag(board, coordinate(1, 1))
    expect(flagged.cells[1]?.[1]?.status).toBe('flagged')

    const unflagged = toggleFlag(flagged, coordinate(1, 1))
    expect(unflagged.cells[1]?.[1]?.status).toBe('hidden')
  })

  it('is a no-op on a revealed cell', () => {
    const board = boardWithMines(3, 3, [[0, 0]])
    const revealed = revealCell(board, coordinate(2, 2))
    const attempted = toggleFlag(revealed, coordinate(2, 2))
    expect(attempted).toBe(revealed)
  })
})

describe('countFlaggedCells', () => {
  it('counts only flagged cells', () => {
    let board = boardWithMines(3, 3, [[0, 0]])
    board = toggleFlag(board, coordinate(0, 0))
    board = toggleFlag(board, coordinate(1, 1))
    expect(countFlaggedCells(board)).toBe(2)

    board = toggleFlag(board, coordinate(1, 1))
    expect(countFlaggedCells(board)).toBe(1)
  })
})

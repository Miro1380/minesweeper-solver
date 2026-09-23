import { describe, expect, it } from 'vitest'
import { createEmptyBoard } from './board'
import { createInitialState, gameReducer, type GameState } from './gameReducer'
import { coordinate, type Difficulty } from './types'

const tinyDifficulty: Difficulty = { label: 'Tiny', width: 3, height: 3, mineCount: 1 }

describe('gameReducer', () => {
  it('starts in not_started with an empty, mine-free board', () => {
    const state = createInitialState(tinyDifficulty)
    expect(state.status).toBe('not_started')
    expect(state.board.mines).toBeUndefined()
  })

  it('places mines and starts the game on the first reveal, guaranteeing that cell is safe', () => {
    const state = createInitialState(tinyDifficulty)
    const next = gameReducer(state, { type: 'reveal_cell', coord: coordinate(1, 1) })

    expect(next.board.mines).toBeDefined()
    expect(next.status === 'in_progress' || next.status === 'won').toBe(true)
    expect(next.board.cells[1]?.[1]?.status).toBe('revealed')
  })

  it('toggles a flag on a hidden cell and back', () => {
    const state = createInitialState(tinyDifficulty)
    const flagged = gameReducer(state, { type: 'toggle_flag', coord: coordinate(0, 0) })
    expect(flagged.board.cells[0]?.[0]?.status).toBe('flagged')

    const unflagged = gameReducer(flagged, { type: 'toggle_flag', coord: coordinate(0, 0) })
    expect(unflagged.board.cells[0]?.[0]?.status).toBe('hidden')
  })

  it('ignores reveal/flag actions once the game has been won or lost', () => {
    // A 1x1 board with 0 mines is won immediately by its only reveal.
    const solved: Difficulty = { label: 'Solved', width: 1, height: 1, mineCount: 0 }
    const state = createInitialState(solved)
    const won = gameReducer(state, { type: 'reveal_cell', coord: coordinate(0, 0) })
    expect(won.status).toBe('won')

    const afterFlag = gameReducer(won, { type: 'toggle_flag', coord: coordinate(0, 0) })
    expect(afterFlag).toBe(won)
  })

  it('reveals every mine and ends the game on a mine click', () => {
    // Mines are placed deterministically here (bypassing placeMines'
    // randomness) so the reducer's own mine-hit branch can be tested in
    // isolation: a mid-game board with a known mine at (0,0).
    const difficulty: Difficulty = { label: 'Test', width: 2, height: 2, mineCount: 1 }
    const board = {
      ...createEmptyBoard(2, 2, 1),
      mines: [
        [true, false],
        [false, false],
      ],
    }
    const state: GameState = { board, status: 'in_progress', difficulty }

    const result = gameReducer(state, { type: 'reveal_cell', coord: coordinate(0, 0) })

    expect(result.status).toBe('lost')
    expect(result.board.cells[0]?.[0]?.status).toBe('revealed')
  })

  it('new_game resets to a fresh board for the given difficulty', () => {
    const state = createInitialState(tinyDifficulty)
    const played = gameReducer(state, { type: 'reveal_cell', coord: coordinate(1, 1) })
    const fresh = gameReducer(played, { type: 'new_game', difficulty: tinyDifficulty })

    expect(fresh.status).toBe('not_started')
    expect(fresh.board.mines).toBeUndefined()
  })
})

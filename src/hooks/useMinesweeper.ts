import { useCallback, useMemo, useReducer, useState } from 'react'
import { countFlaggedCells } from '../engine/board'
import { createInitialState, gameReducer } from '../engine/gameReducer'
import { DIFFICULTIES, type Coordinate, type DifficultyKey } from '../engine/types'
import { useTimer } from './useTimer'

export function useMinesweeper(initialDifficulty: DifficultyKey = 'beginner') {
  const [state, dispatch] = useReducer(
    gameReducer,
    DIFFICULTIES[initialDifficulty],
    createInitialState,
  )

  // Bumped on every "New Game" so useTimer knows to restart the clock —
  // the reducer's own state doesn't carry a stable "this is a fresh game"
  // signal that would survive being equal across two different empty boards.
  const [gameNumber, setGameNumber] = useState(0)

  const newGame = useCallback((difficulty: DifficultyKey) => {
    setGameNumber((n) => n + 1)
    dispatch({ type: 'new_game', difficulty: DIFFICULTIES[difficulty] })
  }, [])

  const reveal = useCallback((coord: Coordinate) => {
    dispatch({ type: 'reveal_cell', coord })
  }, [])

  const toggleFlag = useCallback((coord: Coordinate) => {
    dispatch({ type: 'toggle_flag', coord })
  }, [])

  const elapsedMs = useTimer(state.status === 'in_progress', gameNumber)

  const flagsUsed = useMemo(() => countFlaggedCells(state.board), [state.board])
  const minesRemaining = state.difficulty.mineCount - flagsUsed

  return { state, newGame, reveal, toggleFlag, elapsedMs, minesRemaining }
}

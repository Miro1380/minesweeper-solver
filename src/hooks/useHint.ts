import { useCallback, useState } from 'react'
import { findHint } from '../engine/solver'
import type { Board, Deduction } from '../engine/types'

/**
 * Runs the solver on demand rather than after every move — the deduction
 * search is cheap at these board sizes, but recomputing (and re-rendering
 * a hint highlight) on every single reveal would be wasted work for a
 * feature the player only wants occasionally.
 */
export function useHint(board: Board): {
  hint: Deduction | undefined
  requestHint: () => void
  clearHint: () => void
} {
  const [hint, setHint] = useState<Deduction | undefined>(undefined)
  const [prevBoard, setPrevBoard] = useState(board)

  // Any move invalidates the previous hint (it was computed for a board that
  // no longer exists). Adjusted during render, not in an effect, following
  // React's "reset state when a prop changes" pattern.
  if (board !== prevBoard) {
    setPrevBoard(board)
    setHint(undefined)
  }

  const requestHint = useCallback(() => {
    setHint(findHint(board))
  }, [board])

  const clearHint = useCallback(() => {
    setHint(undefined)
  }, [])

  return { hint, requestHint, clearHint }
}

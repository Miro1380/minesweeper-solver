import type { GameStatus } from '../engine/types'
import { formatTime } from '../utils/formatTime'

const FACE: Readonly<Record<GameStatus, string>> = {
  not_started: '🙂',
  in_progress: '🙂',
  won: '😎',
  lost: '😵',
}

interface ToolbarProps {
  readonly status: GameStatus
  readonly minesRemaining: number
  readonly elapsedMs: number
  readonly onNewGame: () => void
  readonly onHint: () => void
  readonly hintDisabled: boolean
}

export function Toolbar({
  status,
  minesRemaining,
  elapsedMs,
  onNewGame,
  onHint,
  hintDisabled,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__counter" aria-label="Mines remaining">
        💣 {minesRemaining}
      </div>
      <button
        type="button"
        className="toolbar__face"
        onClick={onNewGame}
        aria-label="Start a new game"
      >
        {FACE[status]}
      </button>
      <div className="toolbar__counter" aria-label="Elapsed time">
        ⏱ {formatTime(elapsedMs)}
      </div>
      <button type="button" className="toolbar__hint" onClick={onHint} disabled={hintDisabled}>
        Hint
      </button>
    </div>
  )
}

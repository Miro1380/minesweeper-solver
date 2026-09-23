import { formatTime } from '../utils/formatTime'

interface WinLoseModalProps {
  readonly status: 'won' | 'lost'
  readonly elapsedMs: number
  readonly bestMs: number | undefined
  readonly isNewBest: boolean
  readonly onNewGame: () => void
}

export function WinLoseModal({
  status,
  elapsedMs,
  bestMs,
  isNewBest,
  onNewGame,
}: WinLoseModalProps) {
  const won = status === 'won'

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{won ? 'Board cleared!' : 'You hit a mine'}</h2>
        <p className="modal__time">Time: {formatTime(elapsedMs)}</p>
        {won && bestMs !== undefined && (
          <p className="modal__best">
            {isNewBest ? 'New best time! 🎉' : `Best: ${formatTime(bestMs)}`}
          </p>
        )}
        <button type="button" className="modal__button" onClick={onNewGame} autoFocus>
          New Game
        </button>
      </div>
    </div>
  )
}

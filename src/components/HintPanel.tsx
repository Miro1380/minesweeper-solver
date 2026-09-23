import type { Deduction } from '../engine/types'

interface HintPanelProps {
  readonly hint: Deduction | undefined
}

export function HintPanel({ hint }: HintPanelProps) {
  if (!hint) return null

  const verdictLabel = hint.verdict === 'safe' ? 'Safe to reveal' : 'Must be a mine'

  return (
    <div className={`hint-panel hint-panel--${hint.verdict}`} role="status">
      <strong>
        Row {hint.coord.row + 1}, column {hint.coord.col + 1}:
      </strong>{' '}
      {verdictLabel}. {hint.reason}
    </div>
  )
}

import { type Cell as CellType, type Coordinate, assertNever } from '../engine/types'

const NUMBER_COLORS: Readonly<Record<number, string>> = {
  1: '#1a56db',
  2: '#0f766e',
  3: '#dc2626',
  4: '#5b21b6',
  5: '#92400e',
  6: '#0e7490',
  7: '#111827',
  8: '#6b7280',
}

interface CellProps {
  readonly cell: CellType
  readonly coord: Coordinate
  readonly isMine: boolean
  readonly hintVerdict: 'safe' | 'mine' | undefined
  readonly interactive: boolean
  readonly onReveal: (coord: Coordinate) => void
  readonly onToggleFlag: (coord: Coordinate) => void
}

function cellContent(
  cell: CellType,
  isMine: boolean,
): { label: string; color: string | undefined } {
  switch (cell.status) {
    case 'hidden':
      return { label: '', color: undefined }
    case 'flagged':
      return { label: '🚩', color: undefined }
    case 'revealed':
      if (isMine) return { label: '💣', color: undefined }
      if (cell.adjacentMines === 0) return { label: '', color: undefined }
      return { label: String(cell.adjacentMines), color: NUMBER_COLORS[cell.adjacentMines] }
    default:
      return assertNever(cell)
  }
}

export function Cell({
  cell,
  coord,
  isMine,
  hintVerdict,
  interactive,
  onReveal,
  onToggleFlag,
}: CellProps) {
  const { label, color } = cellContent(cell, isMine)
  const isRevealed = cell.status === 'revealed'

  const classNames = ['cell', isRevealed ? 'cell--revealed' : 'cell--hidden']
  if (isRevealed && isMine) classNames.push('cell--mine')
  if (hintVerdict) classNames.push(`cell--hint-${hintVerdict}`)

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      style={color ? { color } : undefined}
      disabled={!interactive || (isRevealed && !isMine)}
      aria-label={`Row ${String(coord.row + 1)}, column ${String(coord.col + 1)}${
        cell.status === 'flagged' ? ', flagged' : ''
      }`}
      onClick={() => {
        onReveal(coord)
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        onToggleFlag(coord)
      }}
    >
      {label}
    </button>
  )
}

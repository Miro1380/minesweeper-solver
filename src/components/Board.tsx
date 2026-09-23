import { Cell } from './Cell'
import type { Board as BoardType, Coordinate, Deduction } from '../engine/types'
import { coordinate, coordinateKey } from '../engine/types'

interface BoardProps {
  readonly board: BoardType
  readonly interactive: boolean
  readonly hint: Deduction | undefined
  readonly onReveal: (coord: Coordinate) => void
  readonly onToggleFlag: (coord: Coordinate) => void
}

export function Board({ board, interactive, hint, onReveal, onToggleFlag }: BoardProps) {
  const hintKey = hint ? coordinateKey(hint.coord) : undefined

  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${String(board.width)}, 1fr)` }}
      role="grid"
      aria-label="Minesweeper board"
    >
      {board.cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const coord = coordinate(rowIndex, colIndex)
          const key = coordinateKey(coord)
          return (
            <Cell
              key={key}
              cell={cell}
              coord={coord}
              isMine={board.mines?.[rowIndex]?.[colIndex] === true}
              hintVerdict={hintKey === key ? hint?.verdict : undefined}
              interactive={interactive}
              onReveal={onReveal}
              onToggleFlag={onToggleFlag}
            />
          )
        }),
      )}
    </div>
  )
}

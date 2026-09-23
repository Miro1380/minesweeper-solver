import { type Board, type Cell, type Coordinate, type MineLayout, coordinate } from './types'

export function createEmptyBoard(width: number, height: number, mineCount: number): Board {
  const cells: Cell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, (): Cell => ({ status: 'hidden' })),
  )
  return { width, height, mineCount, cells, mines: undefined }
}

export function inBounds(board: Pick<Board, 'width' | 'height'>, c: Coordinate): boolean {
  return c.row >= 0 && c.row < board.height && c.col >= 0 && c.col < board.width
}

export function neighborsOf(board: Pick<Board, 'width' | 'height'>, c: Coordinate): Coordinate[] {
  const result: Coordinate[] = []
  for (let dRow = -1; dRow <= 1; dRow++) {
    for (let dCol = -1; dCol <= 1; dCol++) {
      if (dRow === 0 && dCol === 0) continue
      const candidate = coordinate(c.row + dRow, c.col + dCol)
      if (inBounds(board, candidate)) result.push(candidate)
    }
  }
  return result
}

function countAdjacentMines(mines: MineLayout, board: Board, c: Coordinate): number {
  return neighborsOf(board, c).filter((n) => mines[n.row]?.[n.col] === true).length
}

/**
 * Mines are placed lazily, on the first reveal, and never on the revealed
 * cell or its immediate neighbors. This is the classic "first click is
 * always safe (and boring)" guarantee — without it, a new player can lose
 * on turn one purely to bad luck before they've seen any information.
 */
export function placeMines(board: Board, firstClick: Coordinate): Board {
  const cellsExcluding = (forbidden: ReadonlySet<string>): Coordinate[] => {
    const result: Coordinate[] = []
    for (let row = 0; row < board.height; row++) {
      for (let col = 0; col < board.width; col++) {
        if (!forbidden.has(`${row.toString()},${col.toString()}`)) result.push(coordinate(row, col))
      }
    }
    return result
  }

  const firstClickNeighborhood = new Set<string>([
    `${firstClick.row.toString()},${firstClick.col.toString()}`,
    ...neighborsOf(board, firstClick).map((n) => `${n.row.toString()},${n.col.toString()}`),
  ])

  // On a small enough board, excluding the whole first-click neighborhood
  // can leave fewer free cells than `mineCount`. Fall back to excluding
  // only the clicked cell itself, so the invariant "there are always
  // exactly `mineCount` mines" never breaks — the tradeoff is that a mine
  // can then land right next to the first click on tiny boards only.
  const candidates =
    cellsExcluding(firstClickNeighborhood).length >= board.mineCount
      ? cellsExcluding(firstClickNeighborhood)
      : cellsExcluding(new Set([`${firstClick.row.toString()},${firstClick.col.toString()}`]))

  // Fisher-Yates partial shuffle: pick `mineCount` distinct candidates.
  const shuffled = [...candidates]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = shuffled[i]
    const b = shuffled[j]
    if (a === undefined || b === undefined) continue
    shuffled[i] = b
    shuffled[j] = a
  }

  const mineCoords = shuffled.slice(0, board.mineCount)
  const mines: boolean[][] = Array.from({ length: board.height }, () =>
    Array.from({ length: board.width }, () => false),
  )
  for (const c of mineCoords) {
    const mineRow = mines[c.row]
    if (mineRow) mineRow[c.col] = true
  }

  return { ...board, mines }
}

function cloneCells(cells: Board['cells']): Cell[][] {
  return cells.map((row) => [...row])
}

/**
 * Reveals a cell. If it has zero adjacent mines, cascades outward to reveal
 * the connected region of zero-cells and their numbered borders (a flood
 * fill), matching standard Minesweeper behavior.
 */
export function revealCell(board: Board, start: Coordinate): Board {
  if (!board.mines) return board
  const mines = board.mines
  const cells = cloneCells(board.cells)

  const stack: Coordinate[] = [start]
  const visited = new Set<string>()

  while (stack.length > 0) {
    const c = stack.pop()
    if (!c) continue
    const key = `${c.row.toString()},${c.col.toString()}`
    if (visited.has(key)) continue
    visited.add(key)

    const current = cells[c.row]?.[c.col]
    if (!current || current.status === 'revealed' || current.status === 'flagged') continue

    const adjacentMines = countAdjacentMines(mines, board, c)
    const row = cells[c.row]
    if (row) row[c.col] = { status: 'revealed', adjacentMines }

    const isMine = mines[c.row]?.[c.col] === true
    if (!isMine && adjacentMines === 0) {
      for (const n of neighborsOf(board, c)) stack.push(n)
    }
  }

  return { ...board, cells }
}

export function toggleFlag(board: Board, c: Coordinate): Board {
  const current = board.cells[c.row]?.[c.col]
  if (!current || current.status === 'revealed') return board

  const cells = cloneCells(board.cells)
  const row = cells[c.row]
  if (!row) return board
  row[c.col] = current.status === 'flagged' ? { status: 'hidden' } : { status: 'flagged' }
  return { ...board, cells }
}

export function isMineAt(board: Board, c: Coordinate): boolean {
  return board.mines?.[c.row]?.[c.col] === true
}

export function countFlaggedCells(board: Board): number {
  let count = 0
  for (const row of board.cells) {
    for (const cell of row) {
      if (cell.status === 'flagged') count++
    }
  }
  return count
}

/** True once every non-mine cell has been revealed — the win condition. */
export function isBoardCleared(board: Board): boolean {
  if (!board.mines) return false
  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      const cell = board.cells[row]?.[col]
      const mined = board.mines[row]?.[col] === true
      if (!mined && cell?.status !== 'revealed') return false
    }
  }
  return true
}

/** Reveals every mine, used to show the full board when the game is lost. */
export function revealAllMines(board: Board): Board {
  if (!board.mines) return board
  const mines = board.mines
  const cells = cloneCells(board.cells)
  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      if (mines[row]?.[col] === true) {
        const cellRow = cells[row]
        const cell = cellRow?.[col]
        if (cellRow && cell && cell.status !== 'flagged') {
          cellRow[col] = {
            status: 'revealed',
            adjacentMines: countAdjacentMines(mines, board, coordinate(row, col)),
          }
        }
      }
    }
  }
  return { ...board, cells }
}

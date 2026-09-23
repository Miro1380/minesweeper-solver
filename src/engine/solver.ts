import { neighborsOf } from './board'
import { type Board, type Coordinate, type Deduction, coordinate, coordinateKey } from './types'

/**
 * A constraint says "exactly `mineCount` of these hidden cells are mines."
 * Every revealed numbered cell on the board produces one, derived from its
 * own number minus however many of its neighbors are already flagged.
 */
interface Constraint {
  readonly cells: readonly Coordinate[]
  readonly mineCount: number
}

function buildConstraints(board: Board): Constraint[] {
  const constraints: Constraint[] = []

  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      const cell = board.cells[row]?.[col]
      if (cell?.status !== 'revealed' || cell.adjacentMines === 0) continue

      const hidden: Coordinate[] = []
      let flaggedCount = 0
      for (const n of neighborsOf(board, coordinate(row, col))) {
        const neighbor = board.cells[n.row]?.[n.col]
        if (neighbor?.status === 'hidden') hidden.push(n)
        else if (neighbor?.status === 'flagged') flaggedCount++
      }

      if (hidden.length === 0) continue
      constraints.push({ cells: hidden, mineCount: cell.adjacentMines - flaggedCount })
    }
  }

  return constraints
}

function keySetOf(cells: readonly Coordinate[]): ReadonlySet<string> {
  return new Set(cells.map(coordinateKey))
}

function isSubset(smaller: ReadonlySet<string>, larger: ReadonlySet<string>): boolean {
  for (const key of smaller) {
    if (!larger.has(key)) return false
  }
  return true
}

/** Rule 1: if a constraint's mine count equals 0 or equals its cell count,
 * every one of its cells is fully determined (all safe, or all mines). */
function singlePointDeductions(constraints: readonly Constraint[]): Deduction[] {
  const deductions: Deduction[] = []
  for (const constraint of constraints) {
    if (constraint.mineCount === 0) {
      for (const c of constraint.cells) {
        deductions.push({
          coord: c,
          verdict: 'safe',
          reason: 'All adjacent mines already accounted for.',
        })
      }
    } else if (constraint.mineCount === constraint.cells.length) {
      for (const c of constraint.cells) {
        deductions.push({
          coord: c,
          verdict: 'mine',
          reason: 'Remaining hidden neighbors exactly match the remaining mine count.',
        })
      }
    }
  }
  return deductions
}

/**
 * Rule 2 (subset rule): if constraint A's cells are a subset of constraint
 * B's cells, then the *extra* cells in B (i.e. B minus A) must contain
 * exactly `B.mineCount - A.mineCount` mines. When that difference is 0 or
 * equals the number of extra cells, those extra cells are fully determined
 * too — this catches deductions the single-point rule misses because it
 * only ever looks at one constraint at a time.
 */
function subsetDeductions(constraints: readonly Constraint[]): Deduction[] {
  const deductions: Deduction[] = []

  for (const a of constraints) {
    const aKeys = keySetOf(a.cells)
    for (const b of constraints) {
      if (a === b || a.cells.length >= b.cells.length) continue
      const bKeys = keySetOf(b.cells)
      if (!isSubset(aKeys, bKeys)) continue

      const extraCells = b.cells.filter((c) => !aKeys.has(coordinateKey(c)))
      const extraMineCount = b.mineCount - a.mineCount
      if (extraCells.length === 0) continue

      if (extraMineCount === 0) {
        for (const c of extraCells) {
          deductions.push({
            coord: c,
            verdict: 'safe',
            reason: 'Subset deduction against an overlapping clue.',
          })
        }
      } else if (extraMineCount === extraCells.length) {
        for (const c of extraCells) {
          deductions.push({
            coord: c,
            verdict: 'mine',
            reason: 'Subset deduction against an overlapping clue.',
          })
        }
      }
    }
  }

  return deductions
}

/**
 * Runs the full deduction pass and returns every currently provable cell,
 * safe or mine, with no guessing involved. An empty result means the board
 * has no logically-forced move left (the player would have to guess).
 */
export function solve(board: Board): Deduction[] {
  const constraints = buildConstraints(board)
  const all = [...singlePointDeductions(constraints), ...subsetDeductions(constraints)]

  const byKey = new Map<string, Deduction>()
  for (const deduction of all) {
    const key = coordinateKey(deduction.coord)
    if (!byKey.has(key)) byKey.set(key, deduction)
  }
  return [...byKey.values()]
}

/** Picks one deduction to surface as a hint, preferring a safe reveal (more
 * informative than a flag) when both kinds are available. */
export function findHint(board: Board): Deduction | undefined {
  const deductions = solve(board)
  return deductions.find((d) => d.verdict === 'safe') ?? deductions[0]
}

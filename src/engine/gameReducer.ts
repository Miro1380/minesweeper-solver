import {
  createEmptyBoard,
  isBoardCleared,
  isMineAt,
  placeMines,
  revealAllMines,
  revealCell,
  toggleFlag,
} from './board'
import {
  DIFFICULTIES,
  type Board,
  type Coordinate,
  type Difficulty,
  type GameStatus,
  assertNever,
} from './types'

export interface GameState {
  readonly board: Board
  readonly status: GameStatus
  readonly difficulty: Difficulty
}

export type GameAction =
  | { readonly type: 'new_game'; readonly difficulty: Difficulty }
  | { readonly type: 'reveal_cell'; readonly coord: Coordinate }
  | { readonly type: 'toggle_flag'; readonly coord: Coordinate }

export function createInitialState(difficulty: Difficulty = DIFFICULTIES.beginner): GameState {
  return {
    board: createEmptyBoard(difficulty.width, difficulty.height, difficulty.mineCount),
    status: 'not_started',
    difficulty,
  }
}

function statusAfterReveal(board: Board): GameStatus {
  return isBoardCleared(board) ? 'won' : 'in_progress'
}

function handleRevealCell(state: GameState, coord: Coordinate): GameState {
  if (state.status === 'won' || state.status === 'lost') return state

  const existing = state.board.cells[coord.row]?.[coord.col]
  if (existing?.status !== 'hidden') return state

  // First reveal of the game: place mines now, guaranteed clear of this cell.
  const board = state.status === 'not_started' ? placeMines(state.board, coord) : state.board

  if (isMineAt(board, coord)) {
    return { ...state, board: revealAllMines(revealCell(board, coord)), status: 'lost' }
  }

  const revealed = revealCell(board, coord)
  return { ...state, board: revealed, status: statusAfterReveal(revealed) }
}

function handleToggleFlag(state: GameState, coord: Coordinate): GameState {
  if (state.status === 'won' || state.status === 'lost') return state
  return { ...state, board: toggleFlag(state.board, coord) }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'new_game':
      return createInitialState(action.difficulty)
    case 'reveal_cell':
      return handleRevealCell(state, action.coord)
    case 'toggle_flag':
      return handleToggleFlag(state, action.coord)
    default:
      return assertNever(action)
  }
}

// TODO: import whatever types you end up defining in ./types, e.g.:
// import type { Board, Cell, Coordinate } from './types'

import type{Coordinate, Cell, Board, GameStatus } from './types';
import {DIFFICULTIES, coordinate, coordinateKey, assertNever} from './types';

/**
 * TODO: Build a new, empty board: a `height` x `width` grid where every
 * cell is hidden, `mineCount` is recorded, and mines haven't been placed yet.
 */
export function createEmptyBoard(width: number, height: number, mineCount: number):Board {

  const cellArr: Cell[][] = Array.from({ length: height}, () => Array.from({length:width}, () => ({status:'hidden'}) ));
  
  const board:Board = {
    width:width,
    height:height,
    mineCount:mineCount,
    cells: cellArr,
    mines: undefined

  } 
  return board
}

/**
 * TODO: Return true if a coordinate falls within the board's bounds.
 */
export function inBounds(board: Board, position: Coordinate):boolean {

  const colInRange = position.col < board.width && position.col >= 0;
  const rowInRange = position.row < board.height && position.row >= 0;

  return colInRange && rowInRange;
}

/**
 * TODO: Return the (up to 8) neighboring coordinates of a cell, clipped to
 * the board's edges/corners.
 */
export function neighborsOf(board:Board, position: Coordinate):Coordinate[] {
  const neighbors: Coordinate[] = [];


  for(let dRow = -1 ; dRow <= 1 ; dRow++ ){
    for(let dCol = -1 ; dCol <= 1; dCol++){

      //Skip self?
      if(dCol === 0 && dRow === 0){
        continue;
      }
      
      const coord = coordinate(position.row + dRow, position.col + dCol);

      if(inBounds(board, coord)){
        neighbors.push(coord);
      }
    }
  }
    return neighbors;
}

/**
 * TODO: Place `mineCount` mines randomly, never on `firstClick` or its
 * neighbors — so the player's first reveal is always guaranteed safe.
 *
 * Hint: think about what happens on a very small board, where excluding the
 * clicked cell AND all of its neighbors might leave fewer free cells than
 * `mineCount` requires. What should happen then? (There's a real, testable
 * edge case here — don't just assume it can't happen.)
 */
export function placeMines(/* board, firstClick */) {
  throw new Error('TODO: implement placeMines')
}

/**
 * TODO: Reveal a cell. If it has zero adjacent mines, cascade outward and
 * reveal the whole connected region of zero-cells plus their numbered
 * borders (classic Minesweeper "flood fill").
 *
 * Hint: a cell with zero adjacent mines can, by definition, never be
 * adjacent to a mine — so a flood fill starting from a zero-cell will never
 * accidentally reveal a mine. Also think about immutability: this should
 * return a *new* board rather than mutating the one passed in.
 */
export function revealCell(/* board, coordinate */) {
  throw new Error('TODO: implement revealCell')
}

/**
 * TODO: Toggle a cell between "hidden" and "flagged". Should be a no-op on
 * an already-revealed cell.
 */
export function toggleFlag(/* board, coordinate */) {
  throw new Error('TODO: implement toggleFlag')
}

/**
 * TODO: Return whether a given coordinate holds a mine.
 */
export function isMineAt(/* board, coordinate */) {
  throw new Error('TODO: implement isMineAt')
}

/**
 * TODO: Count how many cells are currently flagged (used to show
 * "mines remaining" as mineCount minus this).
 */
export function countFlaggedCells(/* board */) {
  throw new Error('TODO: implement countFlaggedCells')
}

/**
 * TODO: Return true once every non-mine cell has been revealed — the win
 * condition.
 */
export function isBoardCleared(/* board */) {
  throw new Error('TODO: implement isBoardCleared')
}

/**
 * TODO: Reveal every mine on the board (used to show the full board when
 * the game is lost). Should leave already-flagged cells alone.
 */
export function revealAllMines(/* board */) {
  throw new Error('TODO: implement revealAllMines')
}

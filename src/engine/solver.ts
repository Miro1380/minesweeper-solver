// TODO: import whatever you need from ./board and ./types, e.g.:
// import { neighborsOf } from './board'
// import type { Board, Coordinate, Deduction } from './types'

/**
 * This is the centerpiece of the project: a solver that looks at the
 * currently revealed numbers and *proves* which hidden cells are safe or
 * mines — no guessing, no false positives.
 *
 * TODO: Build the deduction engine in two rules:
 *
 * RULE 1 — single-point rule:
 * For every revealed numbered cell, look at its hidden and flagged
 * neighbors. Subtract the flagged count from the cell's number to get
 * "remaining mines among the hidden neighbors". If that's 0, all hidden
 * neighbors are safe. If it equals the number of hidden neighbors, all of
 * them are mines. (If it's neither, that cell alone can't prove anything.)
 *
 * RULE 2 — subset rule (this is what makes it more than a beginner script):
 * Two different numbered cells can each imply a set of hidden neighbors
 * with a required mine count. If one cell's hidden-neighbor set is a
 * *subset* of another overlapping cell's hidden-neighbor set, subtract the
 * two constraints: the difference in mine counts applies to the difference
 * in cells. That can pin down cells rule 1 alone would miss.
 *
 * A reasonable way to structure this:
 * 1. Build a list of "constraints" from the board: one per revealed
 *    numbered cell, each describing its hidden neighbors and how many
 *    mines must be among them (after subtracting flags).
 * 2. Run rule 1 over each constraint independently.
 * 3. Run rule 2 over every pair of constraints.
 * 4. Merge and de-duplicate the results into a `Deduction[]`.
 *
 * Think about what data structure makes "is set A a subset of set B, and
 * what's the difference" cheap to compute (hint: `coordinateKey` + `Set`).
 */
export function solve(/* board */) {
  throw new Error('TODO: implement solve')
}

/**
 * TODO: Pick one deduction to surface as a "Hint" — probably prefer a safe
 * reveal over a mine flag, since revealing gives the player more new
 * information than flagging does. Return undefined if solve() found nothing.
 */
export function findHint(/* board */) {
  throw new Error('TODO: implement findHint')
}

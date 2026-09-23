/**
 * TODO: Render a single board cell as a button.
 *
 * Hints:
 * - Props you'll likely need: the `Cell` data, its `Coordinate`, whether
 *   it holds a mine (only meaningful once the game is over), the current
 *   hint verdict for this cell (if any, to highlight it), whether the board
 *   is still interactive, and reveal/flag callbacks.
 * - Use a `switch` over the cell's `status` (with an `assertNever` default)
 *   to decide what to render: nothing for hidden, a flag icon for flagged,
 *   a number (or nothing, for 0) for revealed — plus a mine icon if this
 *   revealed cell happens to hold a mine.
 * - Classic Minesweeper colors each number differently (1=blue, 2=green,
 *   3=red, etc.) — a small lookup object works well for this.
 * - Left-click should reveal; right-click (`onContextMenu`, with
 *   `event.preventDefault()`) should toggle a flag instead of opening the
 *   browser's context menu.
 */
export function Cell() {
  return null // TODO: implement
}

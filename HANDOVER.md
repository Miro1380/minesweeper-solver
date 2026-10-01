# Handover — Minesweeper Solver (learning project)

## What this is

A Minesweeper implementation the user is writing themselves, to learn TypeScript
deeply. Claude built the scaffolding (tooling, type stubs, TODOs with hints, no
pre-written tests) — the user writes all real logic. **Claude's role: review
code, explain concepts precisely, never write implementation for them** unless
explicitly asked to patch one specific line.

Repo: `github.com/Miro1380/minesweeper-solver`

- `main` = the scaffold (what the user builds on)
- `solution` = Claude's full reference implementation (only to peek at if stuck)
- Local path: `~/Documents/minesweeper-solver`
- **Open item**: git identity (`user.name`/`user.email`) not configured on this
  machine. Discussion of real name vs. handle was left unresolved.

## Collaboration style

- User writes all code; wants bugs pointed at with exact lines + *why*, not
  fixed for them.
- Wants imprecise phrasing corrected exactly, not just "close enough" validation.
- Has some OOP/Java background — expect to contrast against mutation/class thinking.

## Status by file

**`src/engine/types.ts` — done, reviewed, clean.** `Coordinate` (branded +
`coordinate()`/`coordinateKey()`), `Cell` (discriminated union), `Board`,
`GameStatus`, `Difficulty` + `DIFFICULTIES` (`satisfies Record<string,
Difficulty>`), `Deduction`, `assertNever`.

**`src/engine/board.ts` — in progress.**
- `createEmptyBoard` — done, correct.
- `inBounds` — in progress, uncommitted, **has a bug**: uses `<=` instead of
  `<` (valid indices are `0..width-1`/`0..height-1`), doesn't reject negative
  coordinates, and still has a leftover unreachable `throw` after the `if`.
  Not yet reviewed with the user — flag next time it comes up.
- `neighborsOf`, `placeMines`, `revealCell`, `toggleFlag`, `isMineAt`,
  `countFlaggedCells`, `isBoardCleared`, `revealAllMines` — untouched stubs.

**Everything else — untouched stubs.** `solver.ts`, `gameReducer.ts`, all of
`hooks/`, all of `components/`, `App.tsx`. See README's "Suggested build
order" for the intended sequence.

## Concepts already covered this session (don't re-explain from scratch)

- Branded types (`Coordinate`) — structural typing needs a fake field to stop
  plain `{row,col}` literals from being accepted as validated coordinates.
- Discriminated unions vs. one-object-with-many-optional-fields (`Cell`).
- `satisfies` vs. a type annotation — preserves literal keys/values while
  still validating shape; caught a real typo (`heigh` vs `height`) live.
- `never` + `assertNever` — compiler-enforced exhaustiveness checking.
- Template literal interpolation (`${}`) vs. escaping — separate concepts.
- Why this codebase is plain-data + pure functions, not classes: React
  re-renders on reference equality, not deep comparison — mutating in place
  is invisible to React.
- Immutable updates: "copy the path, share the rest" for one nested change,
  vs. "clone once at the top of the function, mutate the local copy freely,
  return it" for multi-cell ops like flood-fill (more practical for that case).
- `Array.from({length}, callback)` vs `Array(n).fill(x)` — `.fill()` shares
  one reference across all slots (bug for nested mutable structures);
  `Array.from`'s callback re-runs per index, producing independent objects.

/**
 * Core domain types for the Minesweeper engine.
 *
 * This module should have ZERO React/DOM dependencies. Everything here is
 * meant to be plain data and pure functions, which is what will let
 * `board.ts` and `solver.ts` be unit-tested without rendering anything.
 *
 * Work through the TODOs below roughly top to bottom — later ones build on
 * earlier ones. Nothing else in the project will compile until these exist,
 * which is expected: this file is the foundation everything imports from.
 */

// TODO: Define a `Coordinate` type for a { row, col } pair.
//
// Hint: consider "branding" it — add an extra readonly field like
// `__brand: 'Coordinate'` that no plain `{ row, col }` object would have.
// That way a coordinate that's been validated against the board can't be
// silently confused with a random `{row, col}` built somewhere else (e.g.
// straight from a mouse event). Write a `coordinate(row, col)` factory
// function to construct one, and a `coordinateKey(c)` helper that returns a
// string key for it (useful as a Map/Set key later in the solver).

// TODO: Define a `Cell` type describing one board cell's state.
//
// Hint: model it as a discriminated union on a `status` field, e.g.
// "hidden" | "flagged" | "revealed" — and only the "revealed" variant
// carries an `adjacentMines: number`. Avoid a single object with a bunch of
// optional/boolean fields (`isRevealed`, `isFlagged`, `mineCount?`); a
// discriminated union makes nonsensical states (flagged AND revealed)
// impossible to even construct, which a switch statement can then narrow on.

// TODO: Define a `Board` type: `width`, `height`, `mineCount`, a 2D grid of
// `Cell`s, and a `mines` grid.
//
// Hint: mines should be placeable lazily — `mines` starts `undefined` and
// only gets set on the player's first reveal, so that first click can never
// be a mine. Think about what type represents "a grid of booleans."

// TODO: Define a `GameStatus` union: "not_started" | "in_progress" | "won" | "lost".

// TODO: Define a `Difficulty` type (label, width, height, mineCount) and a
// `DIFFICULTIES` constant with at least "beginner", "intermediate", and
// "expert" presets.
//
// Hint: `as const satisfies Record<string, Difficulty>` gives you literal
// types for the keys (useful for a `DifficultyKey = keyof typeof DIFFICULTIES`)
// while still checking each entry matches the `Difficulty` shape.

// TODO: Define a `Deduction` type for the solver's output: a `Coordinate`,
// a `verdict` ("safe" | "mine"), and a human-readable `reason` string.

// TODO: Write an `assertNever(x: never): never` helper for exhaustiveness
// checks.
//
// Hint: call it in the `default` case of a `switch` over a union type. As
// long as every other case is handled, `x` is typed `never` there — if you
// later add a new variant to the union and forget to handle it in some
// switch, that switch's `default` branch stops compiling instead of failing
// silently at runtime. This is one of the more distinctive habits of a
// TypeScript codebase versus a plain JS one — use it in `solver.ts` and
// `gameReducer.ts`.

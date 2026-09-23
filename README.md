# Minesweeper Solver — starter kit

A Minesweeper build, with a twist: the "Hint" button doesn't guess, it runs
a real constraint-solving algorithm over the board. This repo is the
**scaffolding** for that project — tooling, file structure, types partially
sketched out, and TODOs with hints — not a finished app. Filling it in is
the point.

## Why this shape

Everything interesting lives in a small, framework-free `src/engine/`
layer: plain functions and data, no React or DOM imports. That's what makes
it possible to unit-test the game logic and the solver on their own,
without rendering anything. React only shows up afterward, in the thin
`hooks/` and `components/` layers built on top of the engine.

## The solver

The centerpiece is `src/engine/solver.ts`. It should prove — not guess —
that a hidden cell is safe or a mine, using two rules:

1. **Single-point rule** — for a revealed cell showing `N`, if the number of
   still-hidden neighbors equals `N` minus already-flagged neighbors, every
   one of those hidden neighbors must be a mine. If that remainder is `0`,
   they're all safe instead.
2. **Subset rule** — the part that makes this more than a beginner's
   script. If one clue's hidden neighbors are a subset of another
   overlapping clue's hidden neighbors, subtracting the two constraints can
   pin down cells the single-point rule alone can't reach.

Full hints for both rules are in the TODO comments in that file.

## Suggested build order

The pieces build on each other, so working roughly in this order avoids
getting stuck importing things that don't exist yet:

1. `src/engine/types.ts` — the data model everything else imports.
2. `src/engine/board.ts` — board creation, mine placement, flood-fill reveal.
3. `src/engine/solver.ts` — the deduction engine.
4. `src/engine/gameReducer.ts` — ties board + solver into game state transitions.
5. `src/hooks/*` — React glue around the engine (`useMinesweeper`,
   `useTimer`, `useHint`, `useLocalStorageState`).
6. `src/components/*` and `src/App.tsx` — the actual UI.

Every file with work left has a `TODO:` comment explaining what's needed
and a hint toward one reasonable approach (not the only one).

## This repo starts red, on purpose

Run `npm run typecheck` right now and you'll see a handful of "declared but
never read" errors on stub function parameters, and `npm run build` will
fail for the same reason — the parameters are named (so you can see what
each function is expected to receive) but unused (since the bodies are just
`throw new Error('TODO: ...')`). Both errors disappear naturally once you
implement each function and actually use its parameters. The GitHub Actions
CI badge will be red until then too — that's expected, not broken tooling.

## No tests are pre-written

Write your own as you implement each piece — the engine's pure functions
(`board.ts`, `solver.ts`) are the easiest and most valuable to test, since
they need no rendering at all. `npm run test:watch` will pick up any
`*.test.ts(x)` file automatically. `src/utils/formatTime.ts` is a good,
small first function to practice on.

## Tech stack

- **React 19 + TypeScript** (`strict`, plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`)
- **Vite** for dev/build
- **Vitest + React Testing Library**, already wired up, for you to write
  tests with
- **ESLint** (`typescript-eslint` strict + type-checked,
  `eslint-plugin-react-hooks`) + **Prettier**
- **GitHub Actions** for CI (typecheck, lint, test, build) and deployment to
  GitHub Pages

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command                | What it does                            |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the Vite dev server               |
| `npm run build`        | Type-check and build for production     |
| `npm run preview`      | Preview the production build locally    |
| `npm run typecheck`    | `tsc --noEmit` across the whole project |
| `npm run lint`         | ESLint                                  |
| `npm run format`       | Prettier, writing changes               |
| `npm run format:check` | Prettier, checking only (used in CI)    |
| `npm test`             | Run the test suite once                 |
| `npm run test:watch`   | Run tests in watch mode                 |

## Project structure

```
src/
  engine/        # Pure TypeScript game logic — no React. TODO, by design.
    types.ts     # Coordinate, Cell, Board, Deduction, and other core types
    board.ts     # Board creation, mine placement, flood-fill reveal, flags
    solver.ts    # The single-point + subset deduction engine
    gameReducer.ts
  hooks/         # React state glue: useMinesweeper, useTimer, useHint, useLocalStorageState
  components/    # Presentational React components
  utils/         # Small shared helpers (e.g. time formatting)
```

The CSS in `src/index.css` is already written and expects the class names
used in the `TODO` comments (`.cell`, `.cell--hidden`, `.board`, `.toolbar`,
etc.) — feel free to follow them for a working look immediately, or rename
and restyle however you like.

## Deployment

This repo deploys to GitHub Pages automatically on every push to `main`
once it actually builds (see [above](#this-repo-starts-red-on-purpose)) via
`.github/workflows/deploy.yml`. Pages is already enabled on this repo with
GitHub Actions as its source — nothing more to configure.

## License

MIT — see [LICENSE](./LICENSE).

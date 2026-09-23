# Minesweeper Solver

A from-scratch Minesweeper built in React + TypeScript, with a real constraint-solving
hint engine underneath — not just a click-and-reveal clone.

**[Live demo](https://Miro1380.github.io/minesweeper-solver/)** (live once the first
deploy finishes — see [Deployment](#deployment) below).

## Why this exists

This project was built to actually learn TypeScript, not just annotate a todo list.
Everything interesting about Minesweeper — the board, the flood-fill reveal, and
especially the solver — lives in a small, framework-free `src/engine/` layer: plain
functions and data, fully unit-tested, with zero React or DOM imports. React only shows
up in the thin `hooks/` and `components/` layers on top.

## The solver

Clicking **Hint** doesn't guess — it runs a real deduction engine (`src/engine/solver.ts`)
over the currently revealed numbers and tells you a cell it can _prove_ is safe or a mine,
plus why:

1. **Single-point rule** — for a revealed cell showing `N`, if the number of still-hidden
   neighbors equals `N` minus already-flagged neighbors, every one of those hidden
   neighbors must be a mine. If that remainder is `0`, they're all safe instead.
2. **Subset rule** — the part that makes this more than a beginner's script. If one
   clue's hidden neighbors are a subset of another overlapping clue's hidden neighbors,
   subtracting the two constraints can pin down the cells that are unique to the larger
   one — deductions the single-point rule alone can't reach.

If neither rule can prove anything, the hint engine says so honestly instead of guessing.
See the tests in `src/engine/solver.test.ts` for worked examples of both rules.

## Tech stack

- **React 19 + TypeScript** (`strict`, plus `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, `noImplicitOverride`)
- **Vite** for dev/build
- **Vitest + React Testing Library** for tests
- **ESLint** (`typescript-eslint` strict + type-checked, `eslint-plugin-react-hooks`) +
  **Prettier**
- **GitHub Actions** for CI (typecheck, lint, test, build) and deployment to GitHub Pages

## Getting started

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. Right-click (or long-press on touch) a cell to
flag it.

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
  engine/        # Pure TypeScript game logic — no React. Fully unit-tested.
    types.ts     # Coordinate, Cell, Board, Deduction, and other core types
    board.ts     # Board creation, mine placement, flood-fill reveal, flags
    solver.ts    # The single-point + subset deduction engine
    gameReducer.ts
  hooks/         # React state glue: useMinesweeper, useTimer, useHint, useLocalStorageState
  components/    # Presentational React components
  utils/         # Small shared helpers (e.g. time formatting)
```

## Deployment

This repo deploys to GitHub Pages automatically on every push to `main` via
`.github/workflows/deploy.yml`. To enable it on your own fork/repo:

1. Push this repo to GitHub as `minesweeper-solver` (or update `base` in
   [`vite.config.ts`](./vite.config.ts) to match your repo name).
2. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` — the `deploy` workflow builds and publishes automatically.

## License

MIT — see [LICENSE](./LICENSE).

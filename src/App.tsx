import { useState } from 'react'
import { Board } from './components/Board'
import { DifficultyPicker } from './components/DifficultyPicker'
import { HintPanel } from './components/HintPanel'
import { Toolbar } from './components/Toolbar'
import { WinLoseModal } from './components/WinLoseModal'
import type { DifficultyKey } from './engine/types'
import { useHint } from './hooks/useHint'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { useMinesweeper } from './hooks/useMinesweeper'

type BestTimes = Partial<Record<DifficultyKey, number>>

const INITIAL_DIFFICULTY: DifficultyKey = 'beginner'

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>(INITIAL_DIFFICULTY)
  const { state, newGame, reveal, toggleFlag, elapsedMs, minesRemaining } =
    useMinesweeper(INITIAL_DIFFICULTY)
  const { hint, requestHint } = useHint(state.board)
  const [bestTimes, setBestTimes] = useLocalStorageState<BestTimes>('minesweeper:best-times', {})
  const [isNewBest, setIsNewBest] = useState(false)

  // Detects the exact render where the game transitions into "won" by
  // comparing against the status seen on the previous render — React's
  // documented pattern for reacting to a change without a `useEffect`
  // (react.dev/learn/you-might-not-need-an-effect). This runs at most once
  // per game: after `setPrevStatus` applies, `state.status === prevStatus`
  // and the block is skipped on every subsequent render until the next win.
  const [prevStatus, setPrevStatus] = useState(state.status)
  if (state.status !== prevStatus) {
    setPrevStatus(state.status)
    if (state.status === 'won') {
      const currentBest = bestTimes[difficulty]
      const achievedNewBest = currentBest === undefined || elapsedMs < currentBest
      setIsNewBest(achievedNewBest)
      if (achievedNewBest) setBestTimes({ ...bestTimes, [difficulty]: elapsedMs })
    } else {
      setIsNewBest(false)
    }
  }

  const handleDifficultyChange = (key: DifficultyKey) => {
    setDifficulty(key)
    newGame(key)
  }

  const handleNewGame = () => {
    newGame(difficulty)
  }

  const isGameOver = state.status === 'won' || state.status === 'lost'
  const interactive = !isGameOver

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Minesweeper Solver</h1>
        <p className="app__subtitle">
          Classic Minesweeper, plus a hint engine that only ever tells you the truth.
        </p>
      </header>

      <DifficultyPicker value={difficulty} onChange={handleDifficultyChange} />

      <Toolbar
        status={state.status}
        minesRemaining={minesRemaining}
        elapsedMs={elapsedMs}
        onNewGame={handleNewGame}
        onHint={requestHint}
        hintDisabled={isGameOver}
      />

      <HintPanel hint={hint} />

      <Board
        board={state.board}
        interactive={interactive}
        hint={hint}
        onReveal={reveal}
        onToggleFlag={toggleFlag}
      />

      {(state.status === 'won' || state.status === 'lost') && (
        <WinLoseModal
          status={state.status}
          elapsedMs={elapsedMs}
          bestMs={bestTimes[difficulty]}
          isNewBest={isNewBest}
          onNewGame={handleNewGame}
        />
      )}

      <footer className="app__footer">
        <p>
          Right-click (or long-press) a cell to flag it. Left-click a flagged cell has no effect
          until unflagged.
        </p>
      </footer>
    </div>
  )
}

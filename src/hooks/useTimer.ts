import { useEffect, useState } from 'react'

/**
 * Milliseconds elapsed while `running` is true. `resetKey` is any value that
 * changes when the clock should restart from zero (e.g. a "game number" —
 * bumped on every "New Game" click).
 *
 * The reset is handled by adjusting state directly during render (comparing
 * against the previous `resetKey`) rather than in a `useEffect` — this is
 * React's documented pattern for "reset state when a prop changes"
 * (react.dev/learn/you-might-not-need-an-effect), and it avoids the extra
 * render an effect-based reset would cause.
 */
export function useTimer(running: boolean, resetKey: unknown): number {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [prevResetKey, setPrevResetKey] = useState(resetKey)

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setElapsedMs(0)
  }

  // The interval itself is a genuine external subscription, so it stays in
  // an effect. Games in this app never pause and resume, so `running` only
  // ever flips false->true once per game — "now" is always the correct
  // start time when that happens.
  useEffect(() => {
    if (!running) return

    const startedAt = Date.now()
    const intervalId = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt)
    }, 200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [running, resetKey])

  return elapsedMs
}

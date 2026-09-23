import { useEffect, useState } from 'react'

function readStorage<T>(key: string, initial: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? initial : (JSON.parse(raw) as T)
  } catch {
    return initial
  }
}

/**
 * A generic, JSON-backed `useState` that persists to `localStorage`.
 * `<T>` is inferred from `initial`, so callers get back a correctly-typed
 * value/setter pair without ever touching `JSON.parse`/`stringify` or
 * worrying about a browser that blocks storage access (private mode, quota).
 *
 * The write to `localStorage` — a real external system — lives in a
 * `useEffect` that syncs whenever `value` changes, rather than inside the
 * `useState` updater itself; a `useState` updater must stay a pure
 * function of its previous value, since React is free to invoke it more
 * than once (e.g. Strict Mode) before committing.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStorage(key, initial))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can throw (quota, private mode) — the in-memory state still works.
    }
  }, [key, value])

  // useState's own setter already accepts a value or an updater function
  // and is stable across renders, so it can be returned as-is.
  return [value, setValue]
}

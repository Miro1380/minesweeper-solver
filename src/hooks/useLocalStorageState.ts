// TODO: import { useState, useEffect } from 'react' (and whatever else you need)

/**
 * TODO: A generic, JSON-backed `useState` that persists to `localStorage`.
 * Should behave like `useState<T>`, but read its initial value from
 * `localStorage[key]` (falling back to `initial`) and keep it in sync on
 * every update.
 *
 * Hints:
 * - Make it generic: `useLocalStorageState<T>(key: string, initial: T)`.
 * - `localStorage.getItem`/`setItem` can throw (private browsing, quota) —
 *   don't let that crash the app.
 * - Where should the actual `localStorage.setItem` call live? A `useState`
 *   updater function must stay a *pure* function of its previous value —
 *   React is allowed to call it more than once before committing (e.g. in
 *   Strict Mode). Writing to an external system like `localStorage` inside
 *   one is a common but subtly incorrect pattern. What's the correct hook
 *   for "synchronize with something outside React whenever a value changes"?
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  throw new Error('TODO: implement useLocalStorageState')
}

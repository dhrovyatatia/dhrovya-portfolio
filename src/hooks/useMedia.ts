import { useSyncExternalStore } from 'react'

/** Subscribe to a media query without extra re-renders. */
export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Desktop journal needs width *and* height for the two-page spread. */
export const useWideJournal = () => useMediaQuery('(min-width: 900px) and (min-height: 560px)')

export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')

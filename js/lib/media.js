// Media-query helpers.
export const matches = (query) => window.matchMedia(query).matches

/** Listen to a media query; returns an unsubscribe function. */
export function onMedia(query, cb) {
  const mql = window.matchMedia(query)
  const handler = () => cb(mql.matches)
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}

export const REDUCED = '(prefers-reduced-motion: reduce)'
/** Desktop journal needs width *and* height for the two-page spread. */
export const WIDE_JOURNAL = '(min-width: 900px) and (min-height: 560px)'
export const FINE_POINTER = '(hover: hover) and (pointer: fine)'

export const reducedMotion = () => matches(REDUCED)

/**
 * Resolves once the editorial faces are actually loaded, so SplitText
 * measures final glyph metrics. Times out so the page never stalls.
 */
let pending: Promise<void> | null = null

export function fontsReady(timeout = 2500): Promise<void> {
  if (pending) return pending
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()
  const loads = [
    '900 100px "Noto Serif Display Variable"',
    'italic 400 40px "Cormorant Garamond Variable"',
    '500 40px "Cormorant Garamond Variable"',
    '400 16px "Instrument Sans Variable"',
    '500 30px "Caveat Variable"',
  ].map((f) => document.fonts.load(f).catch(() => undefined))
  pending = Promise.race([
    Promise.all(loads).then(() => document.fonts.ready).then(() => undefined),
    new Promise<void>((r) => setTimeout(r, timeout)),
  ])
  return pending
}

import type Lenis from 'lenis'

/**
 * Tiny module-level bridge so any component can scroll smoothly
 * without prop-drilling the Lenis instance.
 */
let instance: Lenis | null = null

export const setLenis = (l: Lenis | null) => {
  instance = l
}

export const getLenis = () => instance

export function scrollToTarget(
  target: string | number | HTMLElement,
  opts: { offset?: number; duration?: number; immediate?: boolean } = {},
) {
  const { offset = 0, duration = 1.6, immediate = false } = opts
  if (instance) {
    instance.scrollTo(target, {
      offset,
      duration,
      immediate,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    })
    return
  }
  // Native fallback (reduced motion)
  let top = 0
  if (typeof target === 'number') top = target
  else {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (!el) return
    top = el.getBoundingClientRect().top + window.scrollY
  }
  window.scrollTo({ top: top + offset, behavior: 'auto' })
}

export const lockScroll = (locked: boolean) => {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

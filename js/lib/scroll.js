/**
 * Tiny bridge so any script can scroll smoothly through the one Lenis
 * instance (or natively when motion is reduced).
 */
let instance = null

export const setLenis = (l) => {
  instance = l
}

export const getLenis = () => instance

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function scrollToTarget(target, opts = {}) {
  const { offset = 0, duration = 1.6, immediate = false } = opts
  if (instance) {
    instance.scrollTo(target, { offset, duration, immediate, easing: easeInOutCubic })
    return
  }
  // Native fallback (reduced motion)
  let top = 0
  if (typeof target === 'number') top = target
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    top = el.getBoundingClientRect().top + window.scrollY
  }
  window.scrollTo({ top: top + offset, behavior: 'auto' })
}

export const lockScroll = (locked) => {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

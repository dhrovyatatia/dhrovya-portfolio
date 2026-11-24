import { gsap } from './lib/gsap.js'

/**
 * Touch-friendly single-page journal: pages lift from the left edge and
 * turn away; swipe or tap the arrows. No pinning, no heavy 3D stack.
 *
 * Returns { setIndex(i), destroy() }; swipes report through onIndex(i).
 */
export function createMobileJournal(stage, { reduced, index, onIndex }) {
  const pages = Array.from(stage.querySelectorAll('.mj-page'))
  const count = pages.length
  let current = index

  const layout = (now, animate, from = now) => {
    pages.forEach((el, i) => {
      const turned = i < now
      const depth = Math.max(0, i - now)
      const vars = {
        rotationY: turned ? -165 : 0,
        x: turned ? 0 : Math.min(depth, 3) * 5,
        y: turned ? 0 : Math.min(depth, 3) * 6,
        zIndex: count - i,
        autoAlpha: depth > 3 ? 0 : 1,
        transformPerspective: 1600,
      }
      if (!animate || reduced) gsap.set(el, vars)
      else {
        const isMoving = i >= Math.min(from, now) && i < Math.max(from, now)
        gsap.to(el, { ...vars, duration: isMoving ? 1.1 : 0.8, ease: 'power3.inOut', delay: isMoving ? Math.abs(i - from) * 0.08 : 0.15 })
      }
    })
  }

  // only the open page is reachable by keyboard and screen readers
  const syncA11y = () =>
    pages.forEach((el, i) => {
      const off = i !== current
      el.toggleAttribute('inert', off)
      if (off) el.setAttribute('aria-hidden', 'true')
      else el.removeAttribute('aria-hidden')
    })

  layout(current, false)
  syncA11y()

  // swipe
  let x0 = 0
  let y0 = 0
  let active = false
  const down = (e) => {
    active = true
    x0 = e.clientX
    y0 = e.clientY
  }
  const up = (e) => {
    if (!active) return
    active = false
    const dx = e.clientX - x0
    const dy = e.clientY - y0
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      onIndex(Math.max(0, Math.min(count - 1, current + (dx < 0 ? 1 : -1))))
    }
  }
  stage.addEventListener('pointerdown', down)
  window.addEventListener('pointerup', up)

  return {
    setIndex(i) {
      if (i === current) return
      const from = current
      current = i
      layout(i, true, from)
      syncA11y()
      if (!reduced) {
        gsap.fromTo(
          pages[i].querySelectorAll('[data-anim]'),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.45 },
        )
      }
    },
    destroy() {
      stage.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      const animated = [...pages, ...stage.querySelectorAll('[data-anim]')]
      gsap.killTweensOf(animated)
      gsap.set(animated, { clearProps: 'all' })
    },
  }
}

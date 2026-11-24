import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap.js'
import { setLenis } from './lib/scroll.js'

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
 * Lenis share a single frame loop. Skipped for reduced motion.
 */
export function initSmoothScroll(enabled) {
  if (!enabled) return

  const lenis = new Lenis({
    // frame-rate independent glide: each frame closes ~9% of the gap
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.1,
  })
  setLenis(lenis)
  if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis, __ST: ScrollTrigger })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

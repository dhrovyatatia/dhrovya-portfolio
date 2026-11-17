import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { setLenis } from '../lib/scroll'

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger
 * and Lenis share a single frame loop. Disabled for reduced motion.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
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
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [enabled])
}

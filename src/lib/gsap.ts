import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin)

gsap.defaults({ ease: 'power3.out', duration: 1 })

/** Shared eases — slow, editorial, never bouncy */
export const EASE = {
  page: 'power3.inOut',
  soft: 'expo.out',
  drift: 'sine.inOut',
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, SplitText }

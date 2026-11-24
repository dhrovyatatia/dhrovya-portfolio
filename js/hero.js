import { gsap, ScrollTrigger, SplitText } from './lib/gsap.js'
import { fontsReady } from './lib/fonts.js'
import { scrollToTarget } from './lib/scroll.js'
import { FINE_POINTER, matches } from './lib/media.js'
import { waterState } from './lib/water-state.js'

/**
 * Chapter 01 — the opening.
 * Sequence: still depths → reflections surface → pads drift in →
 * the name rises out of the water → metadata settles → ambient idle.
 */
export function initHero(reduced) {
  const root = document.querySelector('.hero')
  if (!root) return

  const year = root.querySelector('[data-year]')
  if (year) year.textContent = String(new Date().getFullYear())

  root.querySelector('.hero__scroll')?.addEventListener('click', () => scrollToTarget('#about', { duration: 1.8 }))

  fitTitle(root)
  initPond(root, reduced)
  intro(root, reduced)
}

/** Fit the name to the page width, capped by viewport height. */
function fitTitle(root) {
  const h1 = root.querySelector('.hero__title')
  const wrap = root.querySelector('.hero__title-wrap')
  if (!h1 || !wrap) return

  const fit = () => {
    // First name over surname, always.
    const stacked = true
    h1.dataset.stacked = String(stacked)
    h1.style.fontSize = '100px'
    const sx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sx')) || 1
    const natural = h1.scrollWidth * sx
    const byWidth = (100 * wrap.clientWidth) / natural
    const lines = stacked ? 2 : 1
    const byHeight = (window.innerHeight * (window.innerWidth < 640 ? 0.36 : 0.45)) / (0.8 * lines)
    h1.style.fontSize = `${Math.min(byWidth, byHeight)}px`
  }

  fit()
  fontsReady().then(fit)
  new ResizeObserver(() => {
    fit()
    ScrollTrigger.refresh()
  }).observe(wrap)
  window.addEventListener('resize', fit) // height-only changes matter too
}

/** The opening sequence, then the pin that lets the first page slide over. */
function intro(root, reduced) {
  const chars = root.querySelectorAll('.hero__char')
  const meta = root.querySelectorAll('[data-hero-meta]')
  const nav = document.querySelectorAll('[data-intro="nav"]')
  const pads = root.querySelectorAll('.pond-pad')
  const koi = root.querySelectorAll('.pond__koi')
  const statement = root.querySelector('.hero__statement')

  if (reduced) {
    waterState.reveal = 1
    return
  }

  // Initial states, applied before first paint
  gsap.set(chars, { yPercent: 118 })
  gsap.set(meta, { autoAlpha: 0, y: 16 })
  gsap.set(nav, { autoAlpha: 0, y: -10 })
  gsap.set(pads, { autoAlpha: 0, scale: 0.86 })
  gsap.set(koi, { autoAlpha: 0 })
  gsap.set(statement, { autoAlpha: 0 })
  waterState.reveal = 0

  const tl = gsap.timeline({ paused: true, delay: 0.15 })
  tl.to(waterState, { reveal: 1, duration: 3.6, ease: 'power2.inOut' }, 0)
    .to(pads, { autoAlpha: 1, scale: 1, duration: 2.6, ease: 'expo.out', stagger: { each: 0.18, from: 'random' } }, 0.7)
    .to(koi, { autoAlpha: 1, duration: 3, ease: 'sine.inOut' }, 1.4)
    .to(chars, { yPercent: 0, duration: 1.8, ease: 'expo.out', stagger: 0.075 }, 1.25)
    .add(() => {
      const split = SplitText.create(statement, { type: 'words' })
      gsap.set(statement, { autoAlpha: 1 })
      gsap.from(split.words, { autoAlpha: 0, y: 18, filter: 'blur(8px)', duration: 1.4, ease: 'power3.out', stagger: 0.05 })
    }, 2.35)
    .to(nav, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }, 2.6)
    .to(meta, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }, 2.75)

  fontsReady().then(() => tl.play())

  // As the first journal page slides over, the pond scene sinks back.
  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: 'bottom top',
    pin: true,
    pinSpacing: false,
  })
  gsap.to(root.querySelector('.hero__content'), {
    yPercent: -8,
    scale: 0.94,
    autoAlpha: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
  })
}

/** Lily pads drift, koi swim, and pads lean (barely) away from the pointer. */
function initPond(root, reduced) {
  if (reduced) return
  const host = root.querySelector('.pond')
  const rand = gsap.utils.random

  // Slow, independent drifting for every pad.
  host.querySelectorAll('.pad-drift').forEach((el) => {
    gsap.to(el, {
      x: rand(-16, 16),
      y: rand(-12, 12),
      rotation: rand(-7, 7),
      duration: rand(9, 15),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  })

  // Koi glide on long, lazy paths beneath the surface.
  const swim = () => {
    const w = host.clientWidth
    const h = host.clientHeight
    return Array.from(host.querySelectorAll('.pond__koi')).map((el, i) => {
      const pts =
        i === 0
          ? [
              { x: -0.12 * w, y: 0.72 * h },
              { x: 0.25 * w, y: 0.58 * h },
              { x: 0.48 * w, y: 0.8 * h },
              { x: 0.78 * w, y: 0.62 * h },
              { x: 1.12 * w, y: 0.36 * h },
            ]
          : [
              { x: 1.12 * w, y: 0.18 * h },
              { x: 0.7 * w, y: 0.3 * h },
              { x: 0.4 * w, y: 0.16 * h },
              { x: 0.12 * w, y: 0.34 * h },
              { x: -0.12 * w, y: 0.5 * h },
            ]
      return gsap.to(el, {
        motionPath: { path: pts, curviness: 1.25, autoRotate: true },
        xPercent: -50,
        yPercent: -50,
        duration: i === 0 ? 46 : 58,
        ease: 'none',
        repeat: -1,
        delay: i === 0 ? 0 : -20,
      })
    })
  }
  let tweens = swim()
  let timer = 0
  let lastW = window.innerWidth
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastW) < 40) return // ignore mobile toolbar resizes
    lastW = window.innerWidth
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      tweens.forEach((t) => t.kill())
      tweens = swim()
    }, 250)
  })

  // Pads respond — barely — to the pointer, by depth.
  if (!matches(FINE_POINTER)) return
  const movers = Array.from(host.querySelectorAll('.pad-par')).map((el) => ({
    depth: parseFloat(el.dataset.depth || '10'),
    x: gsap.quickTo(el, 'x', { duration: 2.4, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 2.4, ease: 'power3.out' }),
  }))
  window.addEventListener(
    'pointermove',
    (e) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      movers.forEach((m) => {
        m.x(-nx * m.depth)
        m.y(-ny * m.depth)
      })
    },
    { passive: true },
  )
}

import { gsap, ScrollTrigger, SplitText } from './lib/gsap.js'
import { fontsReady } from './lib/fonts.js'

/**
 * Declarative scroll animations. The HTML only describes intent with
 * data attributes; all motion lives here:
 *
 *   data-reveal="lines"   masked line-by-line rise (SplitText)
 *   data-reveal="chars"   masked character rise
 *   data-reveal="words"   soft word fade
 *   data-reveal="fade"    opacity + small rise
 *   data-reveal="draw"    SVG strokes draw in
 *   data-reveal-delay     seconds
 *   data-reveal-start     ScrollTrigger start (default "top 86%")
 *   data-speed="0.85"     parallax (1 = normal scroll speed)
 *   data-page-enter       paper page tilts flat as it slides over the water
 */
export function initReveals(scope, reduced) {
  if (!scope || reduced) return

  const q = (sel) => Array.from(scope.querySelectorAll(sel))

  // Hide text targets synchronously to avoid a flash before fonts load.
  const textTargets = q('[data-reveal="lines"],[data-reveal="chars"],[data-reveal="words"]')
  const fadeTargets = q('[data-reveal="fade"]')
  gsap.set(textTargets, { autoAlpha: 0 })
  gsap.set(fadeTargets, { autoAlpha: 0, y: 28 })

  // A tilted page skews every measurement inside it — on a tall page the
  // bottom can be hundreds of pixels off, so reveals never fire. Lay pages
  // flat while ScrollTrigger measures; the scrub restores the tilt after.
  const pageTilts = []
  ScrollTrigger.addEventListener('refreshInit', () => pageTilts.forEach((t) => t.progress(1)))

  const delay = (el) => parseFloat(el.getAttribute('data-reveal-delay') || '0')
  const trigger = (el) => ({
    trigger: el,
    start: el.getAttribute('data-reveal-start') || 'top 86%',
    once: true,
  })

  // Masks clip at the line box; give descenders (J, g, y, p) room, then
  // drop the masks entirely once the text has arrived.
  const roomy = (masks) => gsap.set(masks, { paddingBottom: '0.24em', marginBottom: '-0.24em' })

  const build = () => {
    // Lines
    q('[data-reveal="lines"]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line-inner' })
      roomy(split.masks)
      gsap.set(el, { autoAlpha: 1 })
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.09,
        delay: delay(el),
        scrollTrigger: trigger(el),
        onComplete: () => split.revert(),
      })
    })

    // Characters — words first, so a line can only ever break between whole words
    q('[data-reveal="chars"]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines,words,chars', mask: 'lines' })
      roomy(split.masks)
      gsap.set(el, { autoAlpha: 1 })
      gsap
        .timeline({ delay: delay(el), scrollTrigger: trigger(el), onComplete: () => split.revert() })
        .from(split.chars, { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: { each: 0.035 } })
    })

    // Words
    q('[data-reveal="words"]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' })
      gsap.set(el, { autoAlpha: 1 })
      gsap.from(split.words, {
        autoAlpha: 0,
        y: 14,
        filter: 'blur(6px)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.035,
        delay: delay(el),
        scrollTrigger: trigger(el),
      })
    })

    // Fade
    fadeTargets.forEach((el) => {
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        delay: delay(el),
        scrollTrigger: trigger(el),
      })
    })

    // SVG line drawings
    q('[data-reveal="draw"]').forEach((svg) => {
      const paths = Array.from(svg.querySelectorAll('path,line,circle,ellipse,polyline'))
      paths.forEach((p) => {
        const len = p.getTotalLength?.() ?? 400
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 2.4,
        ease: 'power2.inOut',
        stagger: 0.06,
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true },
      })
    })

    // Parallax
    q('[data-speed]').forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '1')
      gsap.fromTo(
        el,
        { y: () => (1 - speed) * window.innerHeight * 0.5 },
        {
          y: () => -(1 - speed) * window.innerHeight * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    })

    // Paper pages settle flat as they slide over the pond
    q('[data-page-enter]').forEach((el) => {
      pageTilts.push(
        gsap.fromTo(
          el,
          { rotateX: 7, y: 80, scale: 0.965, transformPerspective: 1800 },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
          },
        ),
      )
    })

    ScrollTrigger.refresh()
  }

  // SplitText needs final font metrics.
  fontsReady().then(build)
}

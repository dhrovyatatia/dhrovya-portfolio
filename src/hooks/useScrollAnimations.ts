import { useLayoutEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'
import { fontsReady } from '../lib/fonts'

/**
 * Declarative scroll animations. Components only describe intent with
 * data attributes; all motion lives here:
 *
 *   data-reveal="lines"   masked line-by-line rise (SplitText)
 *   data-reveal="chars"   masked character rise, with letter-spacing settle
 *   data-reveal="words"   soft word fade
 *   data-reveal="fade"    opacity + small rise
 *   data-reveal="draw"    SVG strokes draw in, scrubbed to scroll
 *   data-reveal-delay     seconds
 *   data-speed="0.85"     parallax (1 = normal scroll speed)
 *   data-page-enter       paper page tilts flat as it slides over the water
 */
export function useScrollAnimations(root: RefObject<HTMLElement | null>, reduced: boolean) {
  useLayoutEffect(() => {
    const scope = root.current
    if (!scope || reduced) return

    const q = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(scope.querySelectorAll<T & Element>(sel)) as T[]

    // Hide text targets synchronously to avoid a flash before fonts load.
    const textTargets = q<HTMLElement>('[data-reveal="lines"],[data-reveal="chars"],[data-reveal="words"]')
    const fadeTargets = q<HTMLElement>('[data-reveal="fade"]')
    gsap.set(textTargets, { autoAlpha: 0 })
    gsap.set(fadeTargets, { autoAlpha: 0, y: 28 })

    let cancelled = false
    const ctx = gsap.context(() => {}, scope)

    // A tilted page skews every measurement inside it — on a tall page the
    // bottom can be hundreds of pixels off, so reveals never fire. Lay pages
    // flat while ScrollTrigger measures; the scrub restores the tilt after.
    const pageTilts: gsap.core.Tween[] = []
    const flatten = () => pageTilts.forEach((t) => t.progress(1))
    ScrollTrigger.addEventListener('refreshInit', flatten)

    const build = () => {
      if (cancelled) return
      ctx.add(() => {
        const delay = (el: Element) => parseFloat(el.getAttribute('data-reveal-delay') || '0')
        const trigger = (el: Element) => ({
          trigger: el,
          start: el.getAttribute('data-reveal-start') || 'top 86%',
          once: true,
        })

        // Masks clip at the line box; give descenders (J, g, y, p) room, then
        // drop the masks entirely once the text has arrived.
        const roomy = (masks: Element[]) => gsap.set(masks, { paddingBottom: '0.24em', marginBottom: '-0.24em' })

        // Lines
        q<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
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

        // Characters
        q<HTMLElement>('[data-reveal="chars"]').forEach((el) => {
          // words first, so a line can only ever break between whole words
          const split = SplitText.create(el, { type: 'lines,words,chars', mask: 'lines' })
          roomy(split.masks)
          gsap.set(el, { autoAlpha: 1 })
          const tl = gsap.timeline({ delay: delay(el), scrollTrigger: trigger(el), onComplete: () => split.revert() })
          tl.from(split.chars, {
            yPercent: 110,
            duration: 1.3,
            ease: 'expo.out',
            stagger: { each: 0.035 },
          })
        })

        // Words
        q<HTMLElement>('[data-reveal="words"]').forEach((el) => {
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
        q<SVGElement>('[data-reveal="draw"]').forEach((svg) => {
          const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>('path,line,circle,ellipse,polyline'))
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
        q<HTMLElement>('[data-speed]').forEach((el) => {
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
        q<HTMLElement>('[data-page-enter]').forEach((el) => {
          const tilt = gsap.fromTo(
            el,
            { rotateX: 7, y: 80, scale: 0.965, transformPerspective: 1800 },
            {
              rotateX: 0,
              y: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: 0.6 },
            },
          )
          pageTilts.push(tilt)
        })
      })
      ScrollTrigger.refresh()
    }

    // SplitText needs final font metrics.
    fontsReady().then(build)

    return () => {
      cancelled = true
      ScrollTrigger.removeEventListener('refreshInit', flatten)
      ctx.revert()
    }
  }, [root, reduced])
}

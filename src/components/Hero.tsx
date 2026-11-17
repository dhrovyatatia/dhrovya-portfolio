import { useCallback, useEffect, useRef } from 'react'
import { site } from '../data/site'
import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'
import { fontsReady } from '../lib/fonts'
import { useGsap } from '../hooks/useGsap'
import { waterState } from './water/waterState'
import { PondLayer } from './organic/PondLayer'
import { scrollToTarget } from '../lib/scroll'

/**
 * Chapter 01 — the opening.
 * Sequence: still depths → reflections surface → pads drift in →
 * the name rises out of the water → metadata settles → ambient idle.
 */
export function Hero({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleWrap = useRef<HTMLDivElement>(null)

  // Fit the name to the page width, capped by viewport height.
  const fit = useCallback(() => {
    const h1 = titleRef.current
    const wrap = titleWrap.current
    if (!h1 || !wrap) return
    // First name over surname, always.
    const stacked = true
    h1.dataset.stacked = String(stacked)
    h1.style.fontSize = '100px'
    const sx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sx')) || 1
    const natural = h1.scrollWidth * sx
    const target = wrap.clientWidth
    const byWidth = (100 * target) / natural
    const lines = stacked ? 2 : 1
    const byHeight = (window.innerHeight * (window.innerWidth < 640 ? 0.36 : 0.45)) / (0.8 * lines)
    h1.style.fontSize = `${Math.min(byWidth, byHeight)}px`
  }, [])

  useEffect(() => {
    fit()
    fontsReady().then(fit)
    const ro = new ResizeObserver(() => {
      fit()
      ScrollTrigger.refresh()
    })
    if (titleWrap.current) ro.observe(titleWrap.current)
    window.addEventListener('resize', fit) // height-only changes can flip the stacking
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [fit])

  useGsap(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>('.hero-char')
      const meta = gsap.utils.toArray<HTMLElement>('[data-hero-meta]')
      const nav = gsap.utils.toArray<HTMLElement>(document.querySelectorAll('[data-intro="nav"]'))
      const pads = gsap.utils.toArray<HTMLElement>('.pond-pad')
      const koi = gsap.utils.toArray<HTMLElement>('.pond-koi')

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
      gsap.set('.hero-statement', { autoAlpha: 0 })
      waterState.reveal = 0

      const tl = gsap.timeline({ paused: true, delay: 0.15 })
      tl.to(waterState, { reveal: 1, duration: 3.6, ease: 'power2.inOut' }, 0)
        .to(pads, { autoAlpha: 1, scale: 1, duration: 2.6, ease: 'expo.out', stagger: { each: 0.18, from: 'random' } }, 0.7)
        .to(koi, { autoAlpha: 1, duration: 3, ease: 'sine.inOut' }, 1.4)
        .to(chars, { yPercent: 0, duration: 1.8, ease: 'expo.out', stagger: 0.075 }, 1.25)
        .add(() => {
          const split = SplitText.create('.hero-statement', { type: 'words' })
          gsap.set('.hero-statement', { autoAlpha: 1 })
          gsap.from(split.words, { autoAlpha: 0, y: 18, filter: 'blur(8px)', duration: 1.4, ease: 'power3.out', stagger: 0.05 })
        }, 2.35)
        .to(nav, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }, 2.6)
        .to(meta, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }, 2.75)

      fontsReady().then(() => tl.play())

      // As the first journal page slides over, the pond scene sinks back.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 0px)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
        })
        gsap.to('.hero-content', {
          yPercent: -8,
          scale: 0.94,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })

      return () => {
        tl.kill()
        mm.revert()
        gsap.set(nav, { clearProps: 'all' })
        waterState.reveal = 1
      }
    },
    root,
    [reduced],
  )

  const words = site.name.toUpperCase().split(/\s+/)

  return (
    <section
      id="home"
      ref={root}
      data-nav-id="home"
      data-nav-theme="dark"
      className="relative z-[1] h-[100svh] overflow-hidden"
      aria-label="Introduction"
    >
      <PondLayer reduced={reduced} />

      <div className="hero-content relative z-[3] flex h-full flex-col px-[var(--gutter)] pb-6 pt-[calc(var(--nav-h)+12px)] sm:pb-8">
        {/* top metadata rail */}
        <div className="flex items-start justify-between text-sage">
          <p className="t-meta-sm" data-hero-meta>
            ( Chapter 01 ) <span className="opacity-60">— The opening</span>
          </p>
          <p className="t-meta-sm hidden text-right sm:block" data-hero-meta>
            A personal journal <span className="opacity-60">· {site.edition} · {site.year}</span>
          </p>
        </div>

        {/* The name */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div ref={titleWrap} className="flex w-full justify-center">
            <h1
              ref={titleRef}
              className="t-display group/name flex w-max shrink-0 items-center gap-x-[0.2em] [--sx-o:50%_50%] whitespace-nowrap text-center text-ivory [text-shadow:0_20px_60px_rgba(2,12,9,0.35)] data-[stacked=true]:flex-col data-[stacked=true]:gap-y-[0.04em]"
              aria-label={site.name}
            >
              {words.map((word, w) => (
                <span key={w} aria-hidden className="flex">
                  {word.split('').map((l, i) => (
                    <span key={i} className="inline-block overflow-clip pb-[0.05em] pt-[0.02em] align-top">
                      <span className="hero-char inline-block">{l}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>
          <p className="hero-statement t-italic mt-[clamp(10px,2vh,28px)] max-w-[22ch] text-balance text-center text-[clamp(22px,3.1vw,44px)] leading-[1.12] text-ivory/90 sm:max-w-[32ch]">
            {site.statement}
          </p>
        </div>

        {/* bottom rail */}
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-[300px]" data-hero-meta>
            <p className="t-meta-sm mb-3 flex items-center gap-2 text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Now
            </p>
            <p className="text-[13.5px] leading-[1.6] text-ivory/80">{site.intro}</p>
          </div>

          <p className="t-meta-sm hidden text-center text-sage md:block" data-hero-meta>
            {site.themes.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="mx-[0.9em] opacity-40">·</span>}
                {t}
              </span>
            ))}
          </p>

          <button
            type="button"
            onClick={() => scrollToTarget('#about', { duration: 1.8 })}
            className="group flex shrink-0 flex-col items-center gap-3 text-sage"
            data-hero-meta
            aria-label="Scroll to the next chapter"
          >
            <span className="t-meta-sm [writing-mode:vertical-rl] transition-colors group-hover:text-ivory">Scroll</span>
            <span className="relative block h-14 w-px overflow-hidden bg-sage/25">
              <span className="scroll-dot absolute left-0 top-0 block h-5 w-px bg-lime" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

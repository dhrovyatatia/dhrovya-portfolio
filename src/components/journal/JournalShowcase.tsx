import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projects } from '../../data/projects'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis, scrollToTarget } from '../../lib/scroll'
import { useWideJournal } from '../../hooks/useMedia'
import { PageFolio } from '../ui/PageFolio'

const Book = lazy(() => import('./Book'))
const MobileJournal = lazy(() => import('./MobileJournal'))

const N = projects.length
const STATES = N + 1 // closed + one per spread
const STEP_VH = 0.75 // scroll distance per page turn, in viewport heights
const pad = (n: number) => String(n).padStart(2, '0')

/** Chapter 03 — the journal of selected work. */
export function JournalShowcase({ reduced }: { reduced: boolean }) {
  const wide = useWideJournal()
  const section = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [target, setTarget] = useState(-1) // desktop: -1 closed
  const [mobileIndex, setMobileIndex] = useState(0)
  const active = wide ? target : mobileIndex

  // ── Desktop: pin the page; scroll position chooses the spread.
  useLayoutEffect(() => {
    if (!wide || !section.current) return
    const trigger = ScrollTrigger.create({
      trigger: section.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * STEP_VH * (STATES - 1) + window.innerHeight * 0.35}`,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const s = Math.min(STATES - 1, Math.floor(self.progress * STATES * 0.9999))
        setTarget(s - 1)
      },
    })
    st.current = trigger
    return () => {
      trigger.kill()
      st.current = null
    }
  }, [wide])

  /** Travel to a spread by scrolling, so scroll and book never disagree. */
  const goTo = useCallback(
    (i: number) => {
      if (!wide) {
        setMobileIndex(Math.max(0, Math.min(N - 1, i)))
        return
      }
      const t = st.current
      if (!t) return
      const clamped = Math.max(-1, Math.min(N - 1, i))
      const p = (clamped + 1 + 0.5) / STATES
      const y = t.start + (t.end - t.start) * p
      const distance = Math.abs(clamped - target)
      if (getLenis()) scrollToTarget(y, { duration: Math.min(2.4, 0.9 + distance * 0.35) })
      else window.scrollTo({ top: y })
    },
    [wide, target],
  )

  // Arrow keys while the journal fills the screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = st.current
      const inView = wide
        ? !!t?.isActive
        : (() => {
            const r = section.current?.getBoundingClientRect()
            return !!r && r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5
          })()
      if (!inView) return
      if ((e.target as HTMLElement)?.closest('input,textarea')) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(active + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(active - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, active, wide])

  // Caption under the book cross-fades when the spread changes.
  const captionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (reduced || !captionRef.current) return
    gsap.fromTo(captionRef.current.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 })
  }, [active, reduced])

  const current = active >= 0 ? projects[active] : null

  return (
    <section
      id="work"
      ref={section}
      data-nav-id="work"
      data-nav-theme="light"
      className="relative z-[5]"
      aria-labelledby="work-title"
      aria-roledescription="journal"
    >
      <div className={wide ? 'flex h-[100svh] flex-col py-3' : 'pb-[10vh]'}>
        <article className={`journal-page paper paper-grain flex flex-col overflow-hidden ${wide ? 'h-full' : ''}`}>
          <div className="page-margin" />

          {/* ghost title behind the book */}
          <p
            aria-hidden
            className="t-display pointer-events-none absolute left-1/2 [--sx-o:50%_50%] top-[52%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(110px,15vw,300px)] text-forest/[0.055]"
          >
            Rabbit holes
          </p>

          <div className="relative px-[clamp(20px,4vw,64px)] pt-[clamp(20px,2.6vw,36px)]">
            <PageFolio left="Chapter 03" center="The journal — a collection of rabbit holes" right="p. 03" />
          </div>

          <div className="relative flex flex-1 flex-col px-[clamp(20px,4vw,64px)]">
            {/* side notes on very wide screens */}
            {wide && (
              <>
                <div className="pointer-events-none absolute left-[clamp(20px,4vw,64px)] top-[8%] z-10 hidden w-[230px] min-[1760px]:block">
                  <h2 id="work-title" className="t-heading text-[46px] text-forest">
                    A collection
                    <br />
                    of rabbit
                    <br />
                    holes
                  </h2>
                  <p className="t-italic mt-4 max-w-[200px] text-[19px] leading-snug text-ink/70">
                    A place for ideas that refused to stay in my head.
                  </p>
                </div>
                <div className="pointer-events-none absolute right-[clamp(20px,4vw,64px)] top-[8%] z-10 hidden w-[180px] text-right min-[1760px]:block">
                  <p className="t-meta-sm text-botanical">Currently open</p>
                  <p className="t-display mt-2 text-[110px] text-forest [--sx-o:100%_50%]">{current ? pad(active + 1) : '—'}</p>
                  <p className="t-meta-sm mt-2 text-ink/55">of {pad(N)}</p>
                </div>
              </>
            )}

            {!wide && (
              <div className="pb-8 pt-10">
                <h2 id={wide ? undefined : 'work-title'} className="t-display t-fit text-[clamp(52px,14vw,110px)] text-forest" data-reveal="chars">
                  A collection
                  <br />
                  of rabbit holes
                </h2>
                <p className="t-italic mt-3 max-w-[30ch] text-[19px] leading-snug text-ink/70">
                  A place for ideas that refused to stay in my head.
                </p>
              </div>
            )}

            <div className={`relative flex flex-1 items-center justify-center ${wide ? '' : 'pb-6'}`}>
              <Suspense fallback={<div className={wide ? 'h-[60vh] w-full' : 'aspect-[0.46] w-[min(100%,440px)]'} />}>
                {wide ? (
                  <Book projects={projects} target={target} reduced={reduced} />
                ) : (
                  <MobileJournal projects={projects} index={mobileIndex} onIndex={setMobileIndex} reduced={reduced} />
                )}
              </Suspense>
            </div>

            {/* Controls */}
            <div className="relative mx-auto flex w-full max-w-[980px] items-center justify-between gap-4 pb-[clamp(16px,2.4vw,28px)] text-forest">
              <button
                type="button"
                className="round-btn"
                onClick={() => goTo(active - 1)}
                disabled={active <= (wide ? -1 : 0)}
                aria-label="Previous page"
              >
                <ArrowLeft size={16} strokeWidth={1.4} />
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
                <div ref={captionRef} className="flex min-h-[38px] flex-col items-center text-center" aria-live="polite">
                  <p className="t-meta-sm text-botanical">
                    {current ? `${pad(active + 1)} / ${pad(N)} — ${current.category}` : `${pad(N)} entries inside`}
                  </p>
                  <p className="t-italic mt-0.5 truncate text-[19px] text-ink/80">
                    {current ? current.title : wide ? 'Scroll to open the journal' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2" role="tablist" aria-label="Journal entries">
                  {projects.map((p, i) => {
                    const on = i === active
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-label={`${p.title} — ${p.category}`}
                        onClick={() => goTo(i)}
                        className="group grid h-6 place-items-center px-0.5"
                      >
                        <span
                          className={`block h-[5px] rounded-full transition-all duration-700 ease-[var(--ease-soft)] ${
                            on ? 'w-7 bg-forest' : 'w-[5px] bg-forest/25 group-hover:bg-forest/60'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                className="round-btn"
                onClick={() => goTo(active + 1)}
                disabled={active >= N - 1}
                aria-label={active === -1 ? 'Open the journal' : 'Next page'}
              >
                <ArrowRight size={16} strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

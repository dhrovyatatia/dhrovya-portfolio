import { Fragment, useRef } from 'react'
import { experience } from '../data/experience'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { Sprig } from './organic/Botanical'

/** Chapter 04 — "Beyond the Classroom": a thread of margin notes, oldest first. */
export function Experience({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null)
  const last = experience.length - 1

  useGsap(
    () => {
      if (reduced) return
      // The thread draws itself as you read down the page.
      gsap.fromTo(
        '.xp-thread-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.xp-list', start: 'top 70%', end: 'bottom 55%', scrub: 0.8 },
        },
      )
      gsap.utils.toArray<HTMLElement>('.xp-row').forEach((row) => {
        const bits = row.querySelectorAll('[data-xp-in]')
        gsap.from(bits, {
          autoAlpha: 0,
          y: 34,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: 'top 86%', once: true },
        })
        gsap.to(row, {
          scrollTrigger: { trigger: row, start: 'top 60%', end: 'bottom 40%', toggleClass: 'is-current' },
        })
      })
      gsap.from('.xp-mark', {
        autoAlpha: 0,
        y: 12,
        rotate: -6,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.xp-list', start: 'top 80%', once: true },
      })
    },
    root,
    [reduced],
  )

  return (
    <section
      id="experience"
      ref={root}
      data-nav-id="experience"
      data-nav-theme="dark"
      className="relative z-[4] px-[var(--gutter)] pb-[16vh] pt-[6vh]"
      aria-labelledby="xp-title"
    >
      {/* a soft shade on the water so the writing reads */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(7,29,23,0.55) 12%, rgba(7,29,23,0.55) 88%, transparent)' }}
      />

      <header className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="t-meta-sm text-sage" data-reveal="fade">
            ( Chapter 04 ) — Field notes
          </p>
          <h2 id="xp-title" className="t-display t-fit mt-5 text-[clamp(56px,8.4vw,176px)] text-ivory" data-reveal="chars">
            Beyond the
            <br />
            classroom
          </h2>
        </div>
        <div className="lg:col-span-4 lg:pb-4">
          <p className="t-italic text-[clamp(20px,1.8vw,26px)] leading-snug text-sage" data-reveal="lines">
            The competitions, conversations, leadership roles and occasional victories that made the journey a little more
            interesting.
          </p>
          <Sprig className="mt-6 h-8 w-16 text-botanical" />
        </div>
      </header>

      <div className="relative mx-auto mt-[clamp(56px,8vw,120px)] max-w-[1320px]">
        {/* where the thread starts */}
        <p className="xp-mark t-hand mb-3 pl-8 text-[24px] leading-none text-botanical md:pl-[calc(220px+48px)]">
          it started here <span aria-hidden>↓</span>
        </p>

        <ol className="xp-list relative">
          {/* the thread */}
          <span aria-hidden className="absolute bottom-0 left-[7px] top-0 w-px bg-botanical/30 md:left-[calc(220px+19px)]">
            <span className="xp-thread-fill absolute inset-0 origin-top bg-sage/70" />
          </span>

          {experience.map((e, i) => {
            const latest = i === last
            return (
              <li
                key={`${e.position}-${i}`}
                className="xp-row group relative grid grid-cols-[16px_1fr] gap-x-5 border-b border-ivory/[0.08] py-9 transition-colors duration-700 first:border-t md:grid-cols-[220px_40px_1fr] md:gap-x-0 md:py-12"
              >
                {/* a quiet wash behind the row being read */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-4 -right-4 -z-10 rounded-[2px] bg-ivory/[0.025] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />

                {/* date column (moves above the title on small screens) */}
                <div className="col-start-2 row-start-1 mb-3 flex items-baseline gap-3 md:col-start-1 md:mb-0 md:block md:pr-6 md:pt-2" data-xp-in>
                  <p className="t-italic text-[clamp(22px,2vw,30px)] leading-[1.05] text-ivory/85">{e.duration}</p>
                  {e.tag && <p className="t-meta-sm text-sage/70 md:mt-2">{e.tag}</p>}
                </div>

                {/* node */}
                <div className="col-start-1 row-span-3 row-start-1 flex justify-center pt-[8px] md:col-start-2 md:pt-4">
                  <span className="xp-dot relative block h-[15px] w-[15px] rounded-full border border-botanical bg-ink transition-colors duration-500">
                    <span className="absolute inset-[3px] rounded-full bg-botanical transition-colors duration-500" />
                  </span>
                </div>

                <div className="col-start-2 md:col-start-3 md:pl-6">
                  <div className="flex items-start justify-between gap-6" data-xp-in>
                    <h3 className="t-title max-w-[20ch] text-balance text-[clamp(27px,3.6vw,54px)] uppercase text-ivory transition-[letter-spacing] duration-700 ease-[var(--ease-soft)] group-hover:tracking-[0.01em]">
                      {/* keep hyphenated words (Runner-Up, Co-Writer) whole */}
                      {e.position.split(' ').map((w, k) => (
                        <Fragment key={k}>
                          {k > 0 && ' '}
                          <span className="whitespace-nowrap">{w}</span>
                        </Fragment>
                      ))}
                    </h3>
                    <span className="t-hand mt-1 shrink-0 rotate-[-4deg] text-[24px] leading-none text-botanical">
                      {latest ? 'latest' : `no. ${i + 1}`}
                    </span>
                  </div>
                  <p className="t-italic mt-2 text-[clamp(19px,1.9vw,26px)] leading-snug text-sage" data-xp-in>
                    {e.organization}
                  </p>

                  <ul className="mt-5 max-w-[68ch] space-y-2.5" data-xp-in>
                    {e.points.map((pt, k) => (
                      <li key={k} className="flex gap-3 text-[15.5px] leading-relaxed text-ivory/75">
                        <span aria-hidden className="mt-[0.8em] h-px w-3 shrink-0 bg-lime/60" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>

        {/* …and where it is now */}
        <p className="xp-mark t-hand mt-5 pl-8 text-[24px] leading-none text-botanical md:pl-[calc(220px+48px)]">
          …and still counting
        </p>
      </div>
    </section>
  )
}

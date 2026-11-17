import { useRef } from 'react'
import { skills, tickerWords, type LearningEntry } from '../data/skills'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { PageFolio } from './ui/PageFolio'

/** Chapter 05 — the learning curve, set like the index at the back of a book. */
export function Skills({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null)
  // enough repeats to keep the outlined line full while it slides
  const ticker = Array.from({ length: 4 }, () => tickerWords).flat()

  useGsap(
    () => {
      if (reduced) return
      // The index line slides with the scroll, never on its own.
      gsap.fromTo(
        '.skills-ticker',
        { xPercent: 0 },
        {
          xPercent: -35,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
      gsap.utils.toArray<HTMLElement>('.skill-col').forEach((col, i) => {
        gsap.from(col.querySelectorAll('.skill-item'), {
          autoAlpha: 0,
          x: -14,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.06,
          delay: i * 0.08,
          scrollTrigger: { trigger: col, start: 'top 82%', once: true },
        })
      })
    },
    root,
    [reduced],
  )

  return (
    <section
      id="skills"
      ref={root}
      data-nav-id="experience"
      data-nav-theme="light"
      className="relative z-[5] pb-[14vh]"
      aria-labelledby="skills-title"
    >
      <article className="journal-page paper-warm paper-grain stacked overflow-hidden" data-page-enter>
        <div className="page-margin" />
        <div className="relative px-[clamp(20px,5.5vw,96px)] pt-[clamp(28px,4vw,56px)]">
          <PageFolio left="Chapter 05" center="The learning curve" right="p. 05" />

          <div className="mt-[clamp(40px,6vw,96px)] grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <h2 id="skills-title" className="t-display t-fit text-[clamp(70px,11vw,190px)] text-forest lg:col-span-8" data-reveal="chars">
              The learning
              <br />
              curve
            </h2>
            <p className="t-italic text-[clamp(19px,1.7vw,25px)] leading-snug text-ink/70 lg:col-span-4 lg:pb-3" data-reveal="lines">
              Every classroom, course and challenge adds another layer to the way I see the world. Here&rsquo;s a record of a few.
            </p>
          </div>

          <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 border-t border-ink/20 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((g, gi) => (
              <div
                key={g.title}
                className={`skill-col relative border-ink/15 py-10 md:px-6 xl:py-12 ${gi % 2 === 1 ? 'md:border-l' : ''} ${gi > 0 ? 'xl:border-l' : ''} ${gi >= 2 ? 'border-t md:border-t xl:border-t-0' : gi === 1 ? 'border-t md:border-t-0' : ''} ${gi === 0 ? 'md:pl-0' : ''}`}
              >
                <span className="t-italic block text-[64px] leading-none text-botanical">{g.index}</span>
                <h3 className="t-heading mt-5 text-[clamp(26px,2.1vw,32px)] text-forest">{g.title}</h3>
                <p className="t-hand mt-2 -rotate-1 text-[21px] leading-tight text-botanical/90">{g.note}</p>
                <ul className="mt-5">
                  {g.entries.map((e) => (
                    <Entry key={e.heading} entry={e} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* index ticker */}
        <div aria-hidden className="relative mt-6 overflow-hidden border-t border-ink/15 py-6">
          <p className="skills-ticker t-display whitespace-nowrap text-[clamp(64px,9vw,150px)] text-transparent [-webkit-text-stroke:1px_rgba(9,47,37,0.45)]">
            {ticker.map((s, i) => (
              <span key={i}>
                {s}
                <span className="mx-[0.25em] [-webkit-text-stroke:0] text-botanical/60">·</span>
              </span>
            ))}
          </p>
        </div>
      </article>
    </section>
  )
}

const SCORE = /^(\d+(?:\.\d+)?%)\s*(.*)$/

function Entry({ entry }: { entry: LearningEntry }) {
  return (
    <li className="skill-item group border-b border-dashed border-ink/15 py-5 first:pt-1">
      <div className="relative transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-2">
        <span className="absolute -left-4 top-[0.6em] h-1.5 w-1.5 scale-0 rounded-full bg-lime transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-100" />
        <LeafMark className="absolute right-0 top-1 h-4 w-4 -translate-x-1 text-botanical opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        <p className="t-serif pr-6 text-[clamp(21px,1.6vw,25px)] font-semibold leading-tight text-ink">{entry.heading}</p>
        {entry.sub && <p className="t-serif mt-1 text-[clamp(18px,1.35vw,21px)] font-semibold leading-tight text-ink/80">{entry.sub}</p>}
        {entry.lines?.map((line) => {
          const m = line.match(SCORE)
          return m ? (
            <p key={line} className="mt-2 flex items-baseline gap-2">
              <span className="t-italic text-[clamp(34px,2.8vw,44px)] leading-none text-forest">{m[1]}</span>
              {m[2] && <span className="t-meta text-ink/55">{m[2]}</span>}
            </p>
          ) : (
            <p key={line} className="mt-1.5 text-[15px] leading-relaxed text-ink/75">
              {line}
            </p>
          )
        })}
        {entry.small && <p className="t-meta-sm mt-2.5 text-botanical">{entry.small}</p>}
      </div>
    </li>
  )
}

function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M3 17 C3 8 9 3 17 3 C17 11 12 17 3 17 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 17 L12 8" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

import { ArrowUpRight, Download } from 'lucide-react'
import { experiments } from '../data/experiments'
import { ExperimentArt } from './lab/ExperimentArt'
import { PageFolio } from './ui/PageFolio'
import { ResumeSheet } from './resume/ResumeSheet'
import { SketchArrow } from './organic/Botanical'
import { resume } from '../data/resume'

/* Hand-placed collage, shaped around each photo: column, span, aspect, tilt, offset, parallax speed */
const PLACEMENT = [
  { cls: 'lg:col-start-1 lg:col-span-6 lg:row-start-1', aspect: '4/3', rot: -2, speed: 0.94 },
  { cls: 'lg:col-start-8 lg:col-span-4 lg:row-start-1 lg:mt-[12vh]', aspect: '3/4', rot: 2.5, speed: 1.06 },
  { cls: 'lg:col-start-1 lg:col-span-4 lg:row-start-2 lg:mt-[6vh]', aspect: '4/3', rot: 3, speed: 1.04 },
  { cls: 'lg:col-start-6 lg:col-span-3 lg:row-start-2 lg:mt-[16vh]', aspect: '1/1', rot: -2.5, speed: 0.92 },
  { cls: 'lg:col-start-10 lg:col-span-3 lg:row-start-2 lg:mt-[4vh]', aspect: '1/1', rot: 2, speed: 1.08 },
  { cls: 'lg:col-start-4 lg:col-span-4 lg:row-start-3 lg:mt-[6vh]', aspect: '3/4', rot: -1.5, speed: 0.96 },
]

/** Chapter 06 — a life in fragments: hobbies on a dark graph-paper notebook, then the resume. */
export function Experiments() {
  return (
    <section
      id="experiments"
      data-nav-id="experiments"
      data-nav-theme="dark"
      className="relative z-[5] pb-[14vh]"
      aria-labelledby="lab-title"
    >
      <article className="journal-page lab-sheet graph overflow-hidden" data-page-enter>
        <div className="relative px-[clamp(20px,5.5vw,96px)] pb-[clamp(60px,10vw,160px)] pt-[clamp(28px,4vw,56px)]">
          <PageFolio left="Chapter 06" center="A life in fragments" right="p. 06" tone="ivory" />

          <div className="mt-[clamp(40px,6vw,96px)] grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="t-meta-sm text-lime" data-reveal="fade">
                Non-billable activities · No deadlines
              </p>
              <h2 id="lab-title" className="t-display t-fit mt-5 text-[clamp(56px,8.6vw,180px)] text-ivory" data-reveal="chars">
                A life in
                <br />
                fragments
              </h2>
            </div>
            <div className="relative lg:col-span-4 lg:pb-6" data-reveal="fade" data-reveal-delay="0.3">
              <div className="relative max-w-[320px] rotate-[2deg] bg-ivory px-6 pb-6 pt-7 text-ink shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]">
                <span className="tape -top-2 left-1/2 -translate-x-1/2 -rotate-3" />
                <div className="ruled absolute inset-0 opacity-70" />
                <p className="t-hand relative text-[25px] leading-[1.1]">
                  Not everything I do has to go on LinkedIn.
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-[clamp(56px,8vw,120px)] grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-6">
            {experiments.map((x, i) => {
              const p = PLACEMENT[i % PLACEMENT.length]
              const Tag = x.link ? 'a' : 'div'
              return (
                <li key={x.id} className={p.cls}>
                  <div data-speed={p.speed}>
                    <Tag
                      {...(x.link ? { href: x.link, target: '_blank', rel: 'noreferrer' } : {})}
                      className="group block"
                      style={{ ['--rot' as string]: `${p.rot}deg` }}
                    >
                      <figure className="relative rotate-[var(--rot)] transition-transform duration-700 ease-[var(--ease-soft)] group-hover:rotate-0">
                        <span className="tape -top-2 left-6 -rotate-6" />
                        <div className="bg-paper p-2 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]">
                          <div className="relative overflow-hidden" style={{ aspectRatio: p.aspect }}>
                            <div className="h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.06]">
                              {x.image ? (
                                <img
                                  src={x.image}
                                  alt={x.alt ?? x.title}
                                  className="h-full w-full object-cover"
                                  style={{ objectPosition: x.position }}
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <ExperimentArt kind={x.art} />
                              )}
                            </div>
                            <span className="t-meta-sm absolute left-2 top-2 bg-ink/70 px-1.5 py-0.5 text-ivory/80">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        <figcaption className="mt-4 px-1">
                          <p className="t-meta-sm text-lime/90">Fragment {String(i + 1).padStart(2, '0')}</p>
                          <p className="t-title mt-2 flex items-center gap-2 text-[clamp(26px,2.2vw,34px)] uppercase text-ivory">
                            {x.title}
                            {x.link && (
                              <ArrowUpRight
                                size={18}
                                strokeWidth={1.4}
                                className="-translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                              />
                            )}
                          </p>
                          <p className="t-hand mt-1 text-[22px] leading-[1.1] text-sage">{x.caption}</p>
                        </figcaption>
                      </figure>
                    </Tag>
                  </div>
                </li>
              )
            })}
            {/* a note in the margin beside the last photo */}
            <li aria-hidden className="hidden self-center lg:col-start-9 lg:col-span-3 lg:row-start-3 lg:mt-[10vh] lg:block">
              <p className="t-hand -rotate-3 text-[30px] leading-[1.05] text-sage">
                more fragments
                <br />
                loading&hellip;
              </p>
              <SketchArrow className="mt-3 h-12 w-24 rotate-[160deg] text-botanical" />
            </li>
          </ul>

          {/* the last fragment — a single sheet of paper */}
          <div id="resume" className="relative mt-[clamp(90px,12vw,200px)] scroll-mt-24" aria-labelledby="resume-title">
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-ivory/15 pt-[clamp(36px,5vw,72px)]">
              <div>
                <p className="t-meta-sm text-lime" data-reveal="fade">
                  The paperwork, as promised
                </p>
                <h2 id="resume-title" className="t-display t-fit mt-4 text-[clamp(56px,8vw,150px)] text-ivory" data-reveal="chars">
                  My resume
                </h2>
              </div>
              <div className="flex flex-col items-start gap-3 pb-2 sm:items-end">
                <a
                  href={resume.pdf}
                  download="Dhrovya-Tatia-Resume.pdf"
                  className="btn-pill t-meta text-ivory [--fill:var(--color-lime)] [--hover-ink:var(--color-ink)]"
                >
                  Download PDF <Download size={14} strokeWidth={1.6} />
                </a>
                <p className="t-hand text-[20px] leading-none text-sage">one page, no fluff</p>
              </div>
            </div>

            <div className="relative mx-auto mt-[clamp(40px,5vw,72px)] max-w-[900px]" data-reveal="fade">
              <span className="tape -top-3 left-[12%] z-10 -rotate-6" />
              <span className="tape -top-3 right-[12%] z-10 rotate-6" />
              <ResumeSheet className="relative shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:rotate-[-0.6deg]" />
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}

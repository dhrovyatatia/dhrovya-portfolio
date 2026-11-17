import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { site } from '../data/site'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { PageFolio } from './ui/PageFolio'
import { Footer } from './Footer'
import { LotusSketch } from './organic/Botanical'

/** Chapter 07 — the last page, resting on the journal's back cover. */
export function Contact({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useGsap(
    () => {
      if (reduced) return
      // As the back cover comes into view, the last page settles down onto it.
      gsap.fromTo(
        '.last-page',
        { rotationX: 0, transformPerspective: 2000, transformOrigin: '50% 100%' },
        {
          rotationX: 3,
          scale: 0.985,
          ease: 'none',
          scrollTrigger: { trigger: '.back-cover-foot', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        },
      )
    },
    root,
    [reduced],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <section id="contact" ref={root} data-nav-id="contact" className="relative z-[5]" aria-labelledby="contact-title">
      <div className="cover-board mx-[clamp(6px,1.4vw,24px)] px-[clamp(6px,1.6vw,26px)] pt-[clamp(6px,1.6vw,26px)]">
        <article className="last-page journal-page paper paper-grain stacked !mx-0" data-nav-theme="light">
          <div className="page-margin" />
          <div className="relative px-[clamp(20px,5.5vw,96px)] pb-[clamp(40px,6vw,90px)] pt-[clamp(28px,4vw,56px)]">
            <PageFolio left="Chapter 07" center="The last page" right="p. 07" />

            <h2
              id="contact-title"
              className="t-display t-fit mt-[clamp(48px,7vw,120px)] text-[clamp(42px,10.4vw,200px)] text-forest"
              data-reveal="chars"
            >
              Let&rsquo;s connect.
              <br />
              Professionally
              <br />
              <span className="text-botanical">or otherwise.</span>
            </h2>

            <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-14 border-t border-ink/15 pt-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="t-italic max-w-[38ch] text-[clamp(21px,1.9vw,28px)] leading-snug text-ink/75" data-reveal="lines">
                  Want to discuss business, exchange ideas, debate something unnecessarily specific or just compare questionable
                  Spotify playlists? I&rsquo;m in.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" data-reveal="fade">
                  <a href={`mailto:${site.email}`} className="t-serif link-underline break-all text-[clamp(26px,3.2vw,48px)] leading-tight text-forest">
                    {site.email}
                  </a>
                  <button
                    type="button"
                    onClick={copy}
                    className="t-meta-sm inline-flex items-center gap-2 rounded-full border border-ink/20 px-3 py-2 text-ink/70 transition-colors hover:border-forest hover:text-forest"
                    aria-live="polite"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <a href={`mailto:${site.email}?subject=Hello%20from%20your%20journal`} className="btn-pill t-meta mt-10 text-forest" data-reveal="fade" data-reveal-delay="0.15">
                  Write a letter <ArrowUpRight size={14} strokeWidth={1.5} />
                </a>
              </div>

              <div className="lg:col-span-4 lg:col-start-9">
                <p className="t-meta-sm text-botanical">Elsewhere</p>
                <ul className="mt-4">
                  {site.socials.map((s, i) => (
                    <li key={s.label} className="border-b border-ink/15">
                      <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-4">
                        <span className="t-meta-sm w-6 text-ink/45">0{i + 1}</span>
                        <span className="t-serif text-[clamp(24px,2.2vw,32px)] leading-none text-ink transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-2">
                          {s.label}
                        </span>
                        <ArrowUpRight
                          size={18}
                          strokeWidth={1.3}
                          className="ml-auto text-botanical transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="t-meta-sm mt-6 text-ink/50">
                  {site.location}
                  {site.availability && (
                    <>
                      <span className="mx-2 opacity-50">/</span> {site.availability}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-[clamp(56px,8vw,120px)] flex flex-col items-center text-center">
              <LotusSketch className="h-24 w-20 text-botanical" />
              <p className="t-italic mt-3 text-[22px] text-ink/60">— fin —</p>
              <p className="t-hand mt-2 text-[44px] leading-none text-forest">{site.name}</p>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </section>
  )
}

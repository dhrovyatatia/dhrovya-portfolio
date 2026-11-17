import { about, site } from '../data/site'
import { LotusSketch, SketchArrow, Sprig } from './organic/Botanical'
import { PageFolio } from './ui/PageFolio'
import { PortraitArt } from './ui/PortraitArt'

/** Chapter 02 — the introduction page of the journal. */
export function About() {
  const [lede, ...entries] = about.entries

  return (
    <section
      id="about"
      data-nav-id="about"
      data-nav-theme="light"
      className="relative z-[5] pb-[14vh]"
      aria-labelledby="about-title"
    >
      <article className="journal-page paper paper-grain stacked" data-page-enter>
        <div className="page-margin" />
        <div className="relative px-[clamp(20px,5.5vw,96px)] pb-[clamp(48px,8vw,120px)] pt-[clamp(28px,4vw,56px)]">
          <PageFolio left="Chapter 02" center="The introduction" right="p. 02" />

          <div className="mt-[clamp(40px,7vw,110px)] grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-10">
            {/* Left — heading, annotation, illustration */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[120px]">
                <h2
                  id="about-title"
                  className="t-display t-fit text-[clamp(76px,12vw,200px)] text-forest"
                  data-reveal="chars"
                >
                  Human
                  <br />
                  behind this
                </h2>

                <div className="relative mt-6 flex items-start gap-2 pl-[8%] text-botanical" data-reveal="fade" data-reveal-delay="0.4">
                  <SketchArrow className="mt-1 h-10 w-20 shrink-0 -scale-y-100 rotate-[-10deg]" />
                  <p className="t-hand max-w-[16ch] -rotate-[3deg] text-[26px] leading-[1.05]">{about.annotation}</p>
                </div>

                <div className="mt-10 hidden w-[min(240px,60%)] text-botanical lg:block">
                  <LotusSketch className="h-auto w-full" />
                </div>
              </div>
            </div>

            {/* Right — the words */}
            <div className="lg:col-span-7 lg:pt-4">
              <div className="flex items-baseline gap-4">
                <span className="t-meta-sm text-botanical">01 — {lede.label}</span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>
              <p className="t-serif mt-6 text-[clamp(26px,2.6vw,40px)] leading-[1.18] text-ink" data-reveal="lines">
                {lede.body}
              </p>
              {lede.more && (
                <p className="t-italic mt-5 max-w-[44ch] text-[clamp(19px,1.6vw,24px)] leading-[1.4] text-ink/70" data-reveal="lines">
                  {lede.more}
                </p>
              )}

              <div className="mt-[clamp(48px,6vw,90px)] grid grid-cols-1 gap-12 md:grid-cols-[1fr_minmax(200px,0.8fr)] md:gap-10">
                <div className="flex flex-col gap-10">
                  {entries.map((e, i) => (
                    <div key={e.label} data-reveal="fade" data-reveal-delay={String(i * 0.08)}>
                      <p className="t-meta-sm flex items-center gap-3 text-botanical">
                        <span>0{i + 2}</span>
                        <span className="h-px w-6 bg-botanical/50" />
                        <span>{e.label}</span>
                      </p>
                      <p className="t-body mt-3 max-w-[46ch] text-ink/80">{e.body}</p>
                    </div>
                  ))}
                </div>

                <figure className="relative self-start md:mt-[-40px]" data-speed="0.9">
                  <div className="bob relative rotate-[2.5deg]">
                    <span className="tape -left-4 top-3 -rotate-[32deg]" />
                    <span className="tape -right-5 bottom-8 rotate-[28deg]" />
                    <div className="paper-warm paper-grain relative overflow-hidden p-2.5 shadow-[0_18px_40px_-18px_rgba(7,29,23,0.55)]">
                      <div className="relative aspect-[4/5] overflow-hidden bg-forest">
                        {about.portrait ? (
                          <img src={about.portrait} alt={`Portrait of ${site.name}`} className="h-full w-full object-cover object-[50%_22%]" loading="lazy" decoding="async" />
                        ) : (
                          <PortraitArt />
                        )}
                      </div>
                    </div>
                  </div>
                  <figcaption className="t-hand mt-5 max-w-[24ch] -rotate-[1.5deg] pl-2 text-[22px] leading-[1.1] text-botanical">
                    {about.portraitCaption}
                  </figcaption>
                </figure>
              </div>

              <div className="mt-16 flex items-end justify-between gap-6 border-t border-ink/15 pt-6 text-botanical">
                <Sprig className="h-8 w-16" />
                <p className="t-hand text-[30px] leading-none text-forest">— {site.name}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}

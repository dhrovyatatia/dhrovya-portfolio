import { LilyPad } from './organic/LilyPad'

/**
 * A breath of open water between pages: the chapter number and title,
 * floating with a pad or two. Keeps the scroll reading as one story.
 */
export function ChapterMark({
  numeral,
  title,
  kicker,
  side = 'right',
}: {
  numeral: string
  title: string
  kicker: string
  side?: 'left' | 'right'
}) {
  return (
    <div className="relative z-[4] flex min-h-[46vh] flex-col items-center justify-center px-[var(--gutter)] py-[12vh] text-center" data-nav-theme="dark">
      <div
        aria-hidden
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${side === 'right' ? 'right-[4%]' : 'left-[4%]'}`}
        data-speed="0.8"
      >
        <LilyPad size={200} tone="deep" seed={numeral.length * 13 + 2} notch={side === 'right' ? 160 : -20} className="h-[clamp(90px,12vw,190px)] w-[clamp(90px,12vw,190px)] opacity-90" />
      </div>
      <p className="t-meta-sm text-sage" data-reveal="fade">
        ( Chapter {numeral} )
      </p>
      <h2 className="t-heading mt-5 text-[clamp(54px,9vw,150px)] text-ivory" data-reveal="chars">
        {title}
      </h2>
      <p className="t-italic mt-4 max-w-[38ch] text-[clamp(18px,1.8vw,26px)] text-sage" data-reveal="words">
        {kicker}
      </p>
    </div>
  )
}

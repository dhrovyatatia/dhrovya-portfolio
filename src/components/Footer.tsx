import { ArrowUp } from 'lucide-react'
import { site } from '../data/site'
import { scrollToTarget } from '../lib/scroll'

/** The back cover: cloth board, embossed name, a quiet colophon. */
export function Footer() {
  return (
    <footer className="back-cover-foot relative overflow-hidden pt-14 text-ivory" data-nav-theme="dark">
      <div className="flex flex-col items-start justify-between gap-6 px-[clamp(8px,3vw,48px)] sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img src={site.logo} alt="" width={56} height={56} loading="lazy" className="logo-float h-14 w-14 object-contain opacity-90" />
          <p className="t-meta-sm text-sage">
            © {site.year} {site.name}
            <span className="mx-2 opacity-40">·</span>
            Made by hand, kept on a pond
          </p>
        </div>
        <button
          type="button"
          onClick={() => scrollToTarget(0, { duration: 2.6 })}
          className="t-meta-sm group inline-flex items-center gap-3 text-sage transition-colors hover:text-ivory"
        >
          Back to the first page
          <span className="grid h-9 w-9 place-items-center rounded-full border border-current/40 transition-transform duration-500 group-hover:-translate-y-1">
            <ArrowUp size={14} strokeWidth={1.4} />
          </span>
        </button>
      </div>

      <p
        aria-hidden
        className="t-display t-fit-c emboss pointer-events-none mt-8 select-none whitespace-nowrap text-center text-[clamp(40px,16vw,330px)] leading-[0.72] text-[#0c3529] opacity-90 [text-shadow:0_-1px_0_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.06)]"
        style={{ marginBottom: '-0.12em' }}
      >
        {site.name}
      </p>
    </footer>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Mail, ArrowUpRight } from 'lucide-react'
import { navigation, site } from '../data/site'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { lockScroll, scrollToTarget } from '../lib/scroll'
import { GlassTabs, type GlassTabItem } from './ui/GlassTabs'

const TABS: GlassTabItem[] = navigation.map((n) => ({ id: n.href.slice(1), label: n.label, href: n.href }))
const TRAVEL = 1.8 // seconds for a nav jump

type Theme = 'dark' | 'light'

export function Navigation({ reduced }: { reduced: boolean }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [scrim, setScrim] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  // While a nav jump is travelling, the clicked tab owns the capsule —
  // scroll detection would otherwise drag it through every section passed.
  const lockUntil = useRef(0)

  // Theme + active section: ask the page what is actually beneath the bar.
  // Hit-testing handles pinned, overlapping and fixed layers without bookkeeping.
  useEffect(() => {
    let raf = 0
    let last = 0
    const probe = () => {
      raf = 0
      const x = Math.round(window.innerWidth * 0.5)
      const under = (y: number, attr: string) => {
        for (const el of document.elementsFromPoint(x, y)) {
          if (el.closest('header, #site-menu')) continue
          const hit = el.closest<HTMLElement>(`[${attr}]`)
          if (hit) return hit
        }
        return null
      }
      setScrim(window.scrollY > window.innerHeight * 0.85)
      const t = under(36, 'data-nav-theme')
      if (t) setTheme(t.dataset.navTheme as Theme)
      if (performance.now() < lockUntil.current) return
      const s = under(Math.round(window.innerHeight * 0.5), 'data-nav-id')
      if (s) setActive(s.dataset.navId!)
    }
    const onScroll = () => {
      const now = performance.now()
      if (raf || now - last < 80) return
      last = now
      raf = requestAnimationFrame(probe)
    }
    // the visitor taking the wheel mid-jump hands control back to scroll detection
    const release = () => {
      lockUntil.current = 0
    }
    probe()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    ScrollTrigger.addEventListener('refresh', probe)
    const settle = window.setInterval(probe, 600) // catches the end of smooth scrolls
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      ScrollTrigger.removeEventListener('refresh', probe)
      window.clearInterval(settle)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Menu overlay open / close
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    lockScroll(open)
    const items = menu.querySelectorAll('[data-menu-item]')
    if (open) {
      gsap.set(menu, { visibility: 'visible' })
      const tl = gsap.timeline()
      tl.fromTo(
        menu,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0 : 1, ease: 'expo.inOut' },
      ).fromTo(
        items,
        { yPercent: 110 },
        { yPercent: 0, duration: reduced ? 0 : 1, ease: 'expo.out', stagger: 0.05 },
        reduced ? 0 : 0.45,
      )
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => {
        window.removeEventListener('keydown', onKey)
        tl.kill()
      }
    }
    gsap.to(menu, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: reduced ? 0 : 0.8,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(menu, { visibility: 'hidden' })
      },
    })
  }, [open, reduced])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const delay = open ? 450 : 0 // wait a beat for the menu to lift before travelling
    const id = href.slice(1)
    if (TABS.some((t) => t.id === id)) {
      setActive(id)
      lockUntil.current = performance.now() + delay + (reduced ? 300 : TRAVEL * 1000 + 250)
    }
    setOpen(false)
    // the hero is pinned, so its measured top is unreliable mid-page — home is simply 0
    window.setTimeout(() => scrollToTarget(href === '#home' ? 0 : href, { duration: TRAVEL }), delay)
  }

  const ink = theme === 'dark' && !open ? 'text-ivory' : 'text-ink'

  return (
    <>
      <a href="#about" onClick={go('#about')} className="sr-only-focusable fixed left-4 top-4 z-[100] bg-ivory px-4 py-2 text-ink">
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[80] flex h-[var(--nav-h)] items-center justify-between px-[var(--gutter)] transition-colors duration-700 ${ink}`}
      >
        {/* soft fade so content never collides with the bar */}
        <span
          aria-hidden
          className={`pointer-events-none absolute top-0 -z-10 h-[calc(var(--nav-h)+28px)] transition-opacity duration-700 ${theme === 'light' ? 'inset-x-[clamp(10px,2.6vw,44px)]' : 'inset-x-0'} ${scrim && !open ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background:
              theme === 'light'
                ? 'linear-gradient(to bottom, rgba(243,240,227,0.94) 0%, rgba(243,240,227,0.75) 55%, rgba(243,240,227,0))'
                : 'linear-gradient(to bottom, rgba(7,29,23,0.88) 0%, rgba(7,29,23,0.6) 55%, rgba(7,29,23,0))',
          }}
        />
        {/* Monogram */}
        <a href="#home" onClick={go('#home')} className="group flex items-center gap-3" data-intro="nav" aria-label={`${site.name} — home`}>
          {/* the mark floats gently; the ink version takes over on paper pages */}
          <span className="logo-float relative -my-3 block h-[70px] w-[70px] shrink-0 sm:h-[82px] sm:w-[82px]">
            <span className="relative block h-full w-full transition-transform duration-700 ease-[var(--ease-soft)] group-hover:-rotate-6 group-hover:scale-110">
              <img
                src={site.logo}
                alt=""
                width={64}
                height={64}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(2,14,10,0.45)] transition-opacity duration-700 ${theme === 'light' && !open ? 'opacity-0' : 'opacity-100'}`}
              />
              <img
                src={site.logoInk}
                alt=""
                width={64}
                height={64}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${theme === 'light' && !open ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
          </span>
          <span className="hidden flex-col leading-tight sm:flex md:hidden xl:flex">
            <span className="t-meta">{site.name}</span>
            <span className="t-meta-sm opacity-60">Journal — {site.edition}</span>
          </span>
        </a>

        {/* Center — the glass segmented track, centred on the viewport */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <div data-intro="nav">
            <GlassTabs
              items={TABS}
              active={active}
              surface={theme === 'light' && !open ? 'light' : 'dark'}
              reduced={reduced}
              onSelect={(item, e) => go(item.href)(e)}
              className="[--tab-px:10px] lg:[--tab-px:14px] xl:[--tab-px:17px]"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2.5" data-intro="nav">
          <a
            href={`mailto:${site.email}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-current/30 transition-[border-color,background-color] duration-500 hover:border-current"
            aria-label="Email"
          >
            <Mail size={15} strokeWidth={1.4} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="group flex h-10 items-center gap-3 rounded-full border border-current/30 pl-4 pr-3 transition-colors duration-500 hover:border-current md:max-lg:px-3"
          >
            <span className="t-meta-sm md:max-lg:sr-only">{open ? 'Close' : 'Menu'}</span>
            <span className="relative block h-2.5 w-4" aria-hidden>
              <span
                className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'top-1/2 rotate-45' : 'top-0 group-hover:translate-x-0.5'}`}
              />
              <span
                className={`absolute left-0 h-px bg-current transition-all duration-500 ${open ? 'top-1/2 w-full -rotate-45' : 'bottom-0 w-2/3'}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-page menu — an ivory journal page dropping over the pond */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="paper invisible fixed inset-0 z-[70] flex flex-col justify-between px-[var(--gutter)] pb-8 pt-[calc(var(--nav-h)+4vh)]"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <div className="page-margin" />
        <ol className="relative flex flex-col">
          {navigation.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-ink/10">
              <a
                href={item.href}
                onClick={go(item.href)}
                tabIndex={open ? 0 : -1}
                aria-current={active === item.href.slice(1) ? 'location' : undefined}
                data-menu-item
                className="group flex items-baseline gap-4 py-1.5 sm:gap-8"
              >
                <span className="t-meta-sm flex w-8 items-center gap-1.5 text-botanical">
                  0{i + 1}
                  {active === item.href.slice(1) && <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />}
                </span>
                <span className="t-display text-[clamp(44px,9.5vh,110px)] text-forest transition-[letter-spacing,color] duration-700 group-hover:tracking-[0.02em] group-hover:text-botanical">
                  {item.label}
                </span>
                <span className="t-italic ml-auto hidden text-2xl text-botanical opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block">
                  turn to page {String(i + 1).padStart(2, '0')}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="relative mt-8 flex flex-wrap items-end justify-between gap-6 text-ink">
          <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1} className="t-italic link-underline text-2xl sm:text-3xl">
            {site.email}
          </a>
          <ul className="flex gap-6">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1} className="t-meta inline-flex items-center gap-1 opacity-70 hover:opacity-100">
                  {s.label} <ArrowUpRight size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

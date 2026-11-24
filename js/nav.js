import { gsap, ScrollTrigger } from './lib/gsap.js'
import { lockScroll, scrollToTarget } from './lib/scroll.js'
import { GlassTabs } from './glass-tabs.ts'

const TRAVEL = 1.8 // seconds for a nav jump

/**
 * The header: glass tabs that follow the section being read, a colour
 * theme that follows whatever is beneath the bar, and the full-page menu.
 */
export function initNav(reduced) {
  const header = document.querySelector('.site-header')
  const menu = document.getElementById('site-menu')
  const toggle = header?.querySelector('.menu-btn')
  const track = header?.querySelector('.glass-track')
  if (!header || !menu || !toggle || !track) return

  const label = toggle.querySelector('.menu-btn__label')
  const menuLinks = Array.from(menu.querySelectorAll('a'))
  const menuItems = menu.querySelectorAll('[data-menu-item]')

  let theme = 'dark'
  let open = false
  // While a nav jump is travelling, the clicked tab owns the capsule —
  // scroll detection would otherwise drag it through every section passed.
  let lockUntil = 0

  const tabs = new GlassTabs(track, { reduced, onSelect: (item) => go(item.href) })
  const tabIds = tabs.items.map((t) => t.id)

  /* ── state → DOM ── */
  const paint = () => {
    header.dataset.theme = theme
    header.toggleAttribute('data-open', open)
    tabs.setSurface(theme === 'light' && !open ? 'light' : 'dark')
  }

  const setActive = (id) => {
    tabs.setActive(id)
    menu.querySelectorAll('[data-menu-item]').forEach((a) => {
      if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'location')
      else a.removeAttribute('aria-current')
    })
  }

  /* ── theme + active section: ask the page what is actually beneath the bar ──
     Hit-testing handles pinned, overlapping and fixed layers without bookkeeping. */
  let raf = 0
  let last = 0
  const probe = () => {
    raf = 0
    const x = Math.round(window.innerWidth * 0.5)
    const under = (y, attr) => {
      for (const el of document.elementsFromPoint(x, y)) {
        if (el.closest('header, #site-menu')) continue
        const hit = el.closest(`[${attr}]`)
        if (hit) return hit
      }
      return null
    }
    header.toggleAttribute('data-scrim', window.scrollY > window.innerHeight * 0.85)
    const t = under(36, 'data-nav-theme')
    if (t && t.dataset.navTheme !== theme) {
      theme = t.dataset.navTheme
      paint()
    }
    if (performance.now() < lockUntil) return
    const s = under(Math.round(window.innerHeight * 0.5), 'data-nav-id')
    if (s) setActive(s.dataset.navId)
  }
  const onScroll = () => {
    const now = performance.now()
    if (raf || now - last < 80) return
    last = now
    raf = requestAnimationFrame(probe)
  }
  // the visitor taking the wheel mid-jump hands control back to scroll detection
  const release = () => {
    lockUntil = 0
  }
  probe()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('wheel', release, { passive: true })
  window.addEventListener('touchstart', release, { passive: true })
  ScrollTrigger.addEventListener('refresh', probe)
  window.setInterval(probe, 600) // catches the end of smooth scrolls

  /* ── menu overlay ── */
  let menuTl = null
  const setOpen = (next) => {
    if (next === open) return
    open = next
    paint()
    toggle.setAttribute('aria-expanded', String(open))
    if (label) label.textContent = open ? 'Close' : 'Menu'
    menuLinks.forEach((a) => (a.tabIndex = open ? 0 : -1))
    lockScroll(open)
    menuTl?.kill()

    if (open) {
      gsap.set(menu, { visibility: 'visible' })
      menuTl = gsap
        .timeline()
        .fromTo(
          menu,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0 : 1, ease: 'expo.inOut' },
        )
        .fromTo(
          menuItems,
          { yPercent: 110 },
          { yPercent: 0, duration: reduced ? 0 : 1, ease: 'expo.out', stagger: 0.05 },
          reduced ? 0 : 0.45,
        )
      return
    }
    menuTl = gsap.to(menu, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: reduced ? 0 : 0.8,
      ease: 'expo.inOut',
      onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
    })
  }

  toggle.addEventListener('click', () => setOpen(!open))
  window.addEventListener('keydown', (e) => {
    if (open && e.key === 'Escape') setOpen(false)
  })

  /* ── travelling to a section ── */
  function go(href) {
    const delay = open ? 450 : 0 // wait a beat for the menu to lift before travelling
    const id = href.slice(1)
    if (tabIds.includes(id)) {
      setActive(id)
      lockUntil = performance.now() + delay + (reduced ? 300 : TRAVEL * 1000 + 250)
    }
    setOpen(false)
    // the hero is pinned, so its measured top is unreliable mid-page — home is simply 0
    window.setTimeout(() => scrollToTarget(href === '#home' ? 0 : href, { duration: TRAVEL }), delay)
  }

  // skip link, monogram and menu entries (the glass tabs report through onSelect)
  document.querySelectorAll('[data-nav-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault()
      go(a.getAttribute('href'))
    })
  })

  paint()
}

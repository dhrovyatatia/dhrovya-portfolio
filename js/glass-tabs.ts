/**
 * Liquid-glass segmented navigation — written in TypeScript.
 *
 * One shared track, one capsule that glides between items. The capsule
 * measures its destination, so labels of any width and any breakpoint
 * just work. The markup lives in index.html:
 *
 *   <div class="glass-track" data-surface="dark">
 *     <span class="glass-pill"><span class="glass-sheen"></span></span>
 *     <a class="glass-tab" data-tab="home" href="#home">Home</a> …
 *   </div>
 */
import gsap from 'gsap'
import { fontsReady } from './lib/fonts.js'

/** One tab in the track, read from its <a data-tab> element. */
export interface GlassTabItem {
  readonly id: string
  readonly label: string
  readonly href: string
}

/** What the glass sits on: the dark pond or an ivory paper page. */
export type GlassSurface = 'dark' | 'light'

export interface GlassTabsOptions {
  /** Skip the glide and the sheen (prefers-reduced-motion). */
  reduced: boolean
  /** Called when a tab is clicked; the default link jump is already prevented. */
  onSelect?: (item: GlassTabItem, event: MouseEvent) => void
}

type NavKey = 'ArrowRight' | 'ArrowLeft' | 'Home' | 'End'
const NAV_KEYS: readonly NavKey[] = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
const isNavKey = (key: string): key is NavKey => (NAV_KEYS as readonly string[]).includes(key)

export class GlassTabs {
  readonly items: readonly GlassTabItem[]

  private readonly track: HTMLElement
  private readonly pill: HTMLElement
  private readonly sheen: HTMLElement | null
  private readonly links: HTMLAnchorElement[]
  private readonly reduced: boolean
  private active: string
  private placed = false
  private timeline: gsap.core.Timeline | null = null

  constructor(track: HTMLElement, options: GlassTabsOptions) {
    const pill = track.querySelector<HTMLElement>('.glass-pill')
    if (!pill) throw new Error('GlassTabs: the track needs a .glass-pill')

    this.track = track
    this.pill = pill
    this.sheen = pill.querySelector<HTMLElement>('.glass-sheen')
    this.reduced = options.reduced
    this.links = Array.from(track.querySelectorAll<HTMLAnchorElement>('a[data-tab]'))
    this.items = this.links.map((a) => ({
      id: a.dataset.tab ?? '',
      label: a.textContent?.trim() ?? '',
      href: a.getAttribute('href') ?? '#',
    }))
    this.active = this.links.find((a) => a.hasAttribute('aria-current'))?.dataset.tab ?? this.items[0]?.id ?? ''

    this.links.forEach((link, i) => {
      link.addEventListener('click', (event) => {
        event.preventDefault()
        options.onSelect?.(this.items[i], event)
      })
    })
    track.addEventListener('keydown', (event) => this.onKeyDown(event))

    // Keep the capsule glued to its tab through layout changes.
    const snap = () => this.snap()
    new ResizeObserver(snap).observe(track)
    window.addEventListener('resize', snap)
    fontsReady().then(snap)
    this.snap()
  }

  /** The id of the tab the capsule belongs to. */
  get current(): string {
    return this.active
  }

  /** Move the capsule to another tab (no-op if it is already there). */
  setActive(id: string): void {
    if (id === this.active) return
    this.active = id
    this.links.forEach((a) => {
      if (a.dataset.tab === id) a.setAttribute('aria-current', 'location')
      else a.removeAttribute('aria-current')
    })
    this.glide()
  }

  /** Switch between the pond (dark) and paper (light) glass. */
  setSurface(surface: GlassSurface): void {
    if (this.track.dataset.surface !== surface) this.track.dataset.surface = surface
  }

  private target(): HTMLElement | null {
    return this.links.find((a) => a.dataset.tab === this.active) ?? null
  }

  /** Snap (no animation) — first paint, resizes, font swaps. */
  private snap(): void {
    const el = this.target()
    if (!el) {
      gsap.set(this.pill, { autoAlpha: 0 })
      return
    }
    if (this.timeline?.isActive()) return
    gsap.set(this.pill, { x: el.offsetLeft, width: el.offsetWidth, autoAlpha: 1, scaleX: 1, scaleY: 1 })
    this.placed = true
  }

  /** Glide to the active tab: fast departure, squash, damped settle, sheen. */
  private glide(): void {
    const pill = this.pill
    const el = this.target()
    if (!el) {
      gsap.to(pill, { autoAlpha: 0, duration: 0.3 })
      return
    }
    const x = el.offsetLeft
    const width = el.offsetWidth
    if (!this.placed || this.reduced) {
      this.timeline?.kill()
      gsap.set(pill, { x, width, autoAlpha: 1, scaleX: 1, scaleY: 1 })
      this.placed = true
      return
    }

    const from = Number(gsap.getProperty(pill, 'x'))
    const dist = Math.abs(x - from)
    if (dist < 1 && Math.abs(Number(gsap.getProperty(pill, 'width')) - width) < 1) return

    const dir: 1 | -1 = x > from ? 1 : -1
    const travel = gsap.utils.clamp(0.52, 0.74, 0.5 + dist / 1600)

    this.timeline?.kill()
    const t = gsap.timeline()
    t.to(pill, { autoAlpha: 1, duration: 0.2 }, 0)
      // the glide — fast departure, long soft arrival
      .to(pill, { x, width, duration: travel, ease: 'expo.out' }, 0)
      // the glass flattens as it moves, leaning into the direction of travel…
      .to(
        pill,
        {
          scaleY: 0.86,
          scaleX: 1 + Math.min(0.1, dist / 2400),
          transformOrigin: dir > 0 ? '35% 50%' : '65% 50%',
          duration: 0.16,
          ease: 'power2.out',
        },
        0,
      )
      // …then settles with a gentle, damped spring
      .to(pill, { scaleY: 1, scaleX: 1, duration: travel + 0.18, ease: 'elastic.out(1, 0.62)' }, 0.16)

    // a reflection sweeps across the capsule in the direction of travel
    if (this.sheen) {
      t.fromTo(
        this.sheen,
        { xPercent: dir > 0 ? -150 : 220 },
        { xPercent: dir > 0 ? 220 : -150, duration: travel + 0.25, ease: 'power2.inOut' },
        0.04,
      )
    }
    this.timeline = t
  }

  /** Arrow keys, Home and End move focus along the track. */
  private onKeyDown(event: KeyboardEvent): void {
    if (!isNavKey(event.key)) return
    const i = this.links.indexOf(document.activeElement as HTMLAnchorElement)
    if (i < 0) return
    event.preventDefault()
    const n = this.links.length
    const next =
      event.key === 'Home' ? 0 : event.key === 'End' ? n - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + n) % n
    this.links[next]?.focus()
  }
}

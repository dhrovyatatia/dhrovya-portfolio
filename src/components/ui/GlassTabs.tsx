import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { fontsReady } from '../../lib/fonts'

export type GlassTabItem = { id: string; label: string; href: string }

/**
 * Liquid-glass segmented navigation: one shared track, one capsule that
 * glides between items. The capsule measures its destination, so labels
 * of any width and any breakpoint just work.
 */
export function GlassTabs({
  items,
  active,
  onSelect,
  surface,
  reduced,
  className = '',
  label = 'Primary',
}: {
  items: readonly GlassTabItem[]
  active: string
  onSelect: (item: GlassTabItem, e: React.MouseEvent) => void
  surface: 'dark' | 'light'
  reduced: boolean
  className?: string
  label?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)
  const sheenRef = useRef<HTMLSpanElement>(null)
  const placed = useRef(false)
  const tl = useRef<gsap.core.Timeline | null>(null)

  const target = useCallback(() => {
    return trackRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`) ?? null
  }, [active])

  // Snap (no animation) — first paint, resizes, font swaps.
  const snap = useCallback(() => {
    const pill = pillRef.current
    const el = target()
    if (!pill) return
    if (!el) {
      gsap.set(pill, { autoAlpha: 0 })
      return
    }
    if (tl.current?.isActive()) return
    gsap.set(pill, { x: el.offsetLeft, width: el.offsetWidth, autoAlpha: 1, scaleX: 1, scaleY: 1 })
    placed.current = true
  }, [target])

  // Glide to the new active tab.
  useLayoutEffect(() => {
    const pill = pillRef.current
    const el = target()
    if (!pill) return
    if (!el) {
      gsap.to(pill, { autoAlpha: 0, duration: 0.3 })
      return
    }
    const x = el.offsetLeft
    const width = el.offsetWidth
    if (!placed.current || reduced) {
      tl.current?.kill()
      gsap.set(pill, { x, width, autoAlpha: 1, scaleX: 1, scaleY: 1 })
      placed.current = true
      return
    }

    const from = Number(gsap.getProperty(pill, 'x'))
    const dist = Math.abs(x - from)
    if (dist < 1 && Math.abs(Number(gsap.getProperty(pill, 'width')) - width) < 1) return

    const dir = x > from ? 1 : -1
    const travel = gsap.utils.clamp(0.52, 0.74, 0.5 + dist / 1600)

    tl.current?.kill()
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
    if (sheenRef.current) {
      t.fromTo(
        sheenRef.current,
        { xPercent: dir > 0 ? -150 : 220 },
        { xPercent: dir > 0 ? 220 : -150, duration: travel + 0.25, ease: 'power2.inOut' },
        0.04,
      )
    }
    tl.current = t
  }, [target, reduced])

  // Keep the capsule glued to its tab through layout changes.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const ro = new ResizeObserver(() => snap())
    ro.observe(track)
    fontsReady().then(snap)
    window.addEventListener('resize', snap)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', snap)
    }
  }, [snap])

  useEffect(() => () => void tl.current?.kill(), [])

  // Arrow keys move focus along the track.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return
    const links = Array.from(trackRef.current?.querySelectorAll<HTMLElement>('[data-tab]') ?? [])
    const i = links.indexOf(document.activeElement as HTMLElement)
    if (i < 0) return
    e.preventDefault()
    const next =
      e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length
    links[next]?.focus()
  }

  return (
    <nav aria-label={label} className={className}>
      <div ref={trackRef} className="glass-track" data-surface={surface} onKeyDown={onKeyDown}>
        <span ref={pillRef} aria-hidden className="glass-pill" style={{ visibility: 'hidden' }}>
          <span ref={sheenRef} className="glass-sheen" />
        </span>
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <a
              key={item.id}
              href={item.href}
              data-tab={item.id}
              onClick={(e) => onSelect(item, e)}
              aria-current={isActive ? 'location' : undefined}
              className="glass-tab t-meta"
            >
              {item.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

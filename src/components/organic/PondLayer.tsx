import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { useGsap } from '../../hooks/useGsap'
import { LilyPad } from './LilyPad'
import { Koi } from './Koi'

type PadSpec = {
  pos: React.CSSProperties
  size: string
  tone: 'fresh' | 'deep' | 'young'
  notch: number
  seed: number
  depth: number
  flower?: boolean
  droplet?: boolean
  front?: boolean
  hideSm?: boolean
}

/* Sparse on purpose — the water should breathe. */
const PADS: PadSpec[] = [
  { pos: { left: '-5%', top: '13%' }, size: 'clamp(150px, 21vw, 320px)', tone: 'fresh', notch: -35, seed: 3, depth: 18, flower: true },
  { pos: { right: '7%', top: '17%' }, size: 'clamp(70px, 9vw, 150px)', tone: 'deep', notch: 140, seed: 11, depth: 10, hideSm: true },
  { pos: { right: '-4%', bottom: '17%' }, size: 'clamp(160px, 19vw, 290px)', tone: 'fresh', notch: 200, seed: 7, depth: 22, droplet: true, front: true },
  { pos: { left: '21%', bottom: '19%' }, size: 'clamp(52px, 5.5vw, 92px)', tone: 'young', notch: 80, seed: 19, depth: 8, hideSm: true },
  { pos: { left: '57%', top: '9%' }, size: 'clamp(40px, 4vw, 64px)', tone: 'young', notch: 250, seed: 23, depth: 6 },
  { pos: { left: '-7%', bottom: '-9%' }, size: 'clamp(160px, 18vw, 260px)', tone: 'deep', notch: -90, seed: 5, depth: 14 },
  { pos: { left: '66%', bottom: '-6%' }, size: 'clamp(70px, 7vw, 120px)', tone: 'deep', notch: 30, seed: 31, depth: 12, hideSm: true },
]

export function PondLayer({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useGsap(
    () => {
      if (reduced) return
      const rand = gsap.utils.random

      // Slow, independent drifting for every pad.
      gsap.utils.toArray<HTMLElement>('.pad-drift').forEach((el) => {
        gsap.to(el, {
          x: rand(-16, 16),
          y: rand(-12, 12),
          rotation: rand(-7, 7),
          duration: rand(9, 15),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // Koi glide on long, lazy paths beneath the surface.
      const swim = () => {
        const host = root.current!
        const w = host.clientWidth
        const h = host.clientHeight
        return gsap.utils.toArray<HTMLElement>('.koi-swimmer').map((el, i) => {
          const pts =
            i === 0
              ? [
                  { x: -0.12 * w, y: 0.72 * h },
                  { x: 0.25 * w, y: 0.58 * h },
                  { x: 0.48 * w, y: 0.8 * h },
                  { x: 0.78 * w, y: 0.62 * h },
                  { x: 1.12 * w, y: 0.36 * h },
                ]
              : [
                  { x: 1.12 * w, y: 0.18 * h },
                  { x: 0.7 * w, y: 0.3 * h },
                  { x: 0.4 * w, y: 0.16 * h },
                  { x: 0.12 * w, y: 0.34 * h },
                  { x: -0.12 * w, y: 0.5 * h },
                ]
          return gsap.to(el, {
            motionPath: { path: pts, curviness: 1.25, autoRotate: true },
            xPercent: -50,
            yPercent: -50,
            duration: i === 0 ? 46 : 58,
            ease: 'none',
            repeat: -1,
            delay: i === 0 ? 0 : -20,
          })
        })
      }
      let tweens = swim()
      let to = 0
      let lastW = window.innerWidth
      const resize = () => {
        if (Math.abs(window.innerWidth - lastW) < 40) return // ignore mobile toolbar resizes
        lastW = window.innerWidth
        window.clearTimeout(to)
        to = window.setTimeout(() => {
          tweens.forEach((t) => t.kill())
          tweens = swim()
        }, 250)
      }
      window.addEventListener('resize', resize)

      // Pads respond — barely — to the pointer, by depth.
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      let onMove: ((e: PointerEvent) => void) | null = null
      if (fine) {
        const movers = gsap.utils.toArray<HTMLElement>('.pad-par').map((el) => ({
          depth: parseFloat(el.dataset.depth || '10'),
          x: gsap.quickTo(el, 'x', { duration: 2.4, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 2.4, ease: 'power3.out' }),
        }))
        onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          movers.forEach((m) => {
            m.x(-nx * m.depth)
            m.y(-ny * m.depth)
          })
        }
        window.addEventListener('pointermove', onMove, { passive: true })
      }

      return () => {
        window.removeEventListener('resize', resize)
        if (onMove) window.removeEventListener('pointermove', onMove)
        tweens.forEach((t) => t.kill())
      }
    },
    root,
    [reduced],
  )

  const pad = (p: PadSpec, i: number) => (
    <div
      key={i}
      className={`pond-pad absolute ${p.hideSm ? 'hidden md:block' : ''}`}
      style={{ ...p.pos, width: p.size, height: p.size }}
    >
      <div className="pad-par h-full w-full" data-depth={p.depth}>
        <div className="pad-drift relative h-full w-full will-change-transform">
          <span className="pond-ring" />
          <span className="pond-ring" style={{ animationDelay: '-3.5s' }} />
          <LilyPad
            size={200}
            tone={p.tone}
            notch={p.notch}
            seed={p.seed}
            flower={p.flower}
            droplet={p.droplet}
            className="relative h-full w-full"
          />
        </div>
      </div>
    </div>
  )

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0">
      {/* beneath the surface */}
      <div className="absolute inset-0 z-[1] opacity-[0.32] [filter:blur(0.6px)]">
        {['a', 'b'].map((k, i) => (
          <div key={k} className="pond-koi koi-swimmer absolute left-0 top-0">
            <Koi width={i === 0 ? 120 : 92} />
          </div>
        ))}
      </div>
      {/* on the surface, behind the type */}
      <div className="absolute inset-0 z-[2]">{PADS.filter((p) => !p.front).map(pad)}</div>
      {/* one pad floats over the type, for depth */}
      <div className="absolute inset-0 z-[4]">{PADS.filter((p) => p.front).map(pad)}</div>
    </div>
  )
}

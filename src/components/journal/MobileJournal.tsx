import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { ProjectArt } from './ProjectArt'

interface Props {
  projects: Project[]
  index: number
  onIndex: (i: number) => void
  reduced: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Touch-friendly single-page journal: pages lift from the left edge and
 * turn away; swipe or tap the arrows. No pinning, no heavy 3D stack.
 */
export default function MobileJournal({ projects, index, onIndex, reduced }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const pages = useRef<(HTMLElement | null)[]>([])
  const prev = useRef(index)

  const layout = (current: number, animate: boolean, from = current) => {
    pages.current.forEach((el, i) => {
      if (!el) return
      const turned = i < current
      const depth = Math.max(0, i - current)
      const vars = {
        rotationY: turned ? -165 : 0,
        x: turned ? 0 : Math.min(depth, 3) * 5,
        y: turned ? 0 : Math.min(depth, 3) * 6,
        zIndex: projects.length - i,
        autoAlpha: depth > 3 ? 0 : 1,
        transformPerspective: 1600,
      }
      if (!animate || reduced) gsap.set(el, vars)
      else {
        const moving = (i >= Math.min(from, current) && i < Math.max(from, current))
        gsap.to(el, { ...vars, duration: moving ? 1.1 : 0.8, ease: 'power3.inOut', delay: moving ? Math.abs(i - from) * 0.08 : 0.15 })
      }
    })
  }

  useLayoutEffect(() => {
    layout(index, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (prev.current === index) return
    const from = prev.current
    prev.current = index
    layout(index, true, from)
    const el = pages.current[index]
    if (el && !reduced) {
      gsap.fromTo(
        el.querySelectorAll('[data-anim]'),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.45 },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // swipe
  useEffect(() => {
    const s = stage.current
    if (!s) return
    let x0 = 0
    let y0 = 0
    let active = false
    const down = (e: PointerEvent) => {
      active = true
      x0 = e.clientX
      y0 = e.clientY
    }
    const up = (e: PointerEvent) => {
      if (!active) return
      active = false
      const dx = e.clientX - x0
      const dy = e.clientY - y0
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        onIndex(Math.max(0, Math.min(projects.length - 1, index + (dx < 0 ? 1 : -1))))
      }
    }
    s.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      s.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [index, onIndex, projects.length])

  return (
    <div
      ref={stage}
      className="mj-stage relative mx-auto aspect-[0.46] w-[min(100%,440px)] touch-pan-y select-none"
    >
      {projects.map((p, i) => (
        <article
          key={p.id}
          ref={(el) => {
            pages.current[i] = el
          }}
          className="mj-page paper overflow-hidden"
          aria-hidden={i !== index}
          inert={i !== index}
        >
          <div className="jpage is-right">
            <div className="absolute inset-0 flex flex-col px-[7cqw] pb-[6cqw] pt-[6cqw]">
              <div className="cq-meta flex justify-between text-ink/55">
                <span>{p.category}</span>
                <span>No. {pad(i + 1)}</span>
              </div>
              <div className="relative mt-[4cqw] aspect-[16/10] shrink-0 overflow-hidden border border-forest/70 bg-forest">
                <div className="spread-art">
                  {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" loading="lazy" /> : <ProjectArt kind={p.art} />}
                </div>
              </div>
              <div className="mt-[5cqw] flex items-baseline gap-[3cqw]" data-anim>
                <span className="t-italic text-[11cqw] leading-none text-botanical">{pad(i + 1)}</span>
                <h3 className="t-title text-[9cqw] uppercase text-forest">{p.title}</h3>
              </div>
              {p.tagline && (
                <p className="t-italic mt-[1.5cqw] text-[max(15px,4.4cqw)] leading-snug text-botanical" data-anim>
                  {p.tagline}
                </p>
              )}
              <p className="cq-body mt-[3cqw] text-[max(13px,3.5cqw)] !leading-[1.55] text-ink/80" data-anim>
                {p.description}
              </p>
              <div className="mt-auto flex flex-col gap-[2.5cqw] border-t border-ink/15 pt-[3cqw]" data-anim>
                <p>
                  <span className="cq-meta block text-botanical">Role</span>
                  <span className="t-serif text-[max(14px,4cqw)] leading-snug">{p.role}</span>
                </p>
                <p>
                  <span className="cq-meta block text-botanical">{p.listLabel ?? 'Skills'}</span>
                  <span className="t-serif text-[max(14px,4cqw)] leading-snug">{p.technologies.join(' · ')}</span>
                </p>
              </div>
              {p.note && (
                <p className="t-hand mt-[3cqw] -rotate-1 text-[max(16px,5cqw)] leading-none text-botanical" data-anim>
                  {p.note}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { Project } from '../../data/projects'
import { gsap } from '../../lib/gsap'
import { CoverBack, CoverFront, NotesPage, PlatePage } from './ProjectPages'

interface Props {
  projects: Project[]
  /** -1 = closed, 0..N-1 = open at that spread */
  target: number
  reduced: boolean
  onSettle?: (index: number) => void
}

/**
 * A two-page CSS-3D journal.
 *
 * Spread i = plate (left) + notes (right) of project i.
 * Leaf k (0..N-2) carries notes[k] on its front and plate[k+1] on its back.
 * The left base shows plate[0]; the right base shows notes[N-1].
 *
 * GSAP composes transforms as translate → rotate, so a leaf's `z` is its
 * true height above the book; flipping interpolates between the right and
 * left stacks with a lift in the middle, which keeps depth-sorting correct.
 */
export default function Book({ projects, target, reduced, onSettle }: Props) {
  const N = projects.length
  const stageRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)
  const leftBaseRef = useRef<HTMLDivElement>(null)
  const shadowLeftRef = useRef<HTMLDivElement>(null)
  const leafRefs = useRef<(HTMLDivElement | null)[]>([])

  const cur = useRef(-1)
  const busy = useRef(false)
  const moving = useRef(false) // inside a multi-page journey
  const targetRef = useRef(target)
  const hiddenSpread = useRef<number | null>(null)
  const revealed = useRef<number | null>(null)
  const settleCb = useRef(onSettle)
  settleCb.current = onSettle

  const E = 0.9 // px between stacked sheets
  const zUnflipped = (k: number) => (N - 1 - k) * E + E
  const zFlipped = (k: number) => (k + 1) * E
  const COVER_CLOSED = N * E + E * 2
  const COVER_OPEN = -1.5

  const q = (sel: string) => Array.from(bookRef.current?.querySelectorAll<HTMLElement>(sel) ?? [])
  const textOf = (i: number) => q(`[data-spread="${i}"][data-side="right"] [data-anim]`)
  const noteOf = (i: number) => q(`[data-spread="${i}"][data-side="left"] [data-anim]`)
  const artOf = (i: number) => q(`[data-spread="${i}"][data-side="left"] [data-art-inner]`)
  const layersOf = (i: number) => q(`[data-spread="${i}"][data-side="left"] [data-layer]`)

  const setEdges = (open: number) => {
    const flipped = Math.max(0, open)
    const unflipped = N - 1 - flipped
    gsap.to(stageRef.current, {
      '--edge-r': `${3 + unflipped * 1.4}px`,
      '--edge-l': `${3 + flipped * 1.4}px`,
      duration: reduced ? 0 : 0.9,
      ease: 'power2.inOut',
    })
  }

  // ── initial pose
  useLayoutEffect(() => {
    gsap.set(bookRef.current, { rotationX: 14, rotationZ: -1.5, xPercent: -25 })
    leafRefs.current.forEach((leaf, k) => leaf && gsap.set(leaf, { rotationY: 0, z: zUnflipped(k), '--shade': 0 }))
    gsap.set(coverRef.current, { rotationY: 0, z: COVER_CLOSED, '--shade': 0 })
    gsap.set([leftBaseRef.current, shadowLeftRef.current], { autoAlpha: 0 })
    setEdges(-1)
    cur.current = -1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── book floats up as it scrolls into view; gentle pointer tilt
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from(introRef.current, {
          y: 90,
          rotationX: 22,
          autoAlpha: 0,
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: stageRef.current, start: 'top 85%', once: true },
        })
      }
    })
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (reduced || !fine) return () => ctx.revert()
    const rx = gsap.quickTo(floatRef.current, 'rotationX', { duration: 1.6, ease: 'power3.out' })
    const ry = gsap.quickTo(floatRef.current, 'rotationY', { duration: 1.6, ease: 'power3.out' })
    const stage = stageRef.current!
    const move = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      ry(nx * 7)
      rx(-ny * 4)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)
    return () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
      ctx.revert()
    }
  }, [reduced])

  // ── one step of the page engine
  // A journey across several pages is one continuous motion: it accelerates
  // into the first leaf, glides through the middle ones at an even pace and
  // eases into the last — no stop-start between pages.
  type Phase = 'single' | 'first' | 'middle' | 'last'
  const TIMING: Record<Phase, { dur: number; ease: string }> = {
    single: { dur: 1.35, ease: 'power3.inOut' },
    first: { dur: 0.6, ease: 'power2.in' },
    middle: { dur: 0.42, ease: 'none' },
    last: { dur: 0.85, ease: 'power3.out' },
  }
  const step = (from: number, to: number, phase: Phase) => {
    const { dur: d, ease } = TIMING[phase]
    const dur = reduced ? 0.001 : d
    const forward = to > from
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    const book = bookRef.current!
    const lift = (book.offsetWidth / 2) * 0.12

    let el: HTMLElement
    let z0: number
    let z1: number
    if (from === -1 || to === -1) {
      el = coverRef.current!
      z0 = COVER_CLOSED
      z1 = COVER_OPEN
    } else {
      const k = forward ? from : to
      el = leafRefs.current[k]!
      z0 = zUnflipped(k)
      z1 = zFlipped(k)
    }

    const proxy = { t: forward ? 0 : 1 }
    const isCover = el === coverRef.current
    tl.to(
      proxy,
      {
        t: forward ? 1 : 0,
        duration: dur,
        ease,
        onUpdate: () => {
          const t = proxy.t
          const s = Math.sin(Math.PI * t)
          gsap.set(el, {
            rotationY: -180 * t,
            z: z0 + (z1 - z0) * t + s * lift,
            '--shade': s * 0.85,
          })
          if (isCover) {
            const open = t > 0.5
            gsap.set(leftBaseRef.current, { autoAlpha: open ? 1 : 0 })
          }
        },
      },
      0,
    )

    if (isCover) {
      tl.to(book, { xPercent: forward ? 0 : -25, duration: dur, ease: 'power3.inOut' }, 0)
      tl.to(shadowLeftRef.current, { autoAlpha: forward ? 1 : 0, duration: dur * 0.6 }, forward ? dur * 0.4 : 0)
    }

    // The whole book answers a single turn: a slight roll toward the moving page.
    // (Skipped mid-journey — restarting it every page reads as a wobble.)
    if (!reduced && phase === 'single') {
      const dir = forward ? 1 : -1
      tl.to(book, { rotationY: -4 * dir, rotationZ: -1.5 + 0.8 * dir, y: -6, duration: dur * 0.5, ease: 'sine.out' }, 0).to(
        book,
        { rotationY: 0, rotationZ: -1.5, y: 0, duration: dur * 0.6, ease: 'sine.inOut' },
        dur * 0.5,
      )
    }

    setEdges(to)
    return tl
  }

  const reveal = (i: number) => {
    if (i < 0 || revealed.current === i) return
    revealed.current = i
    const wasHidden = hiddenSpread.current === i
    hiddenSpread.current = null
    if (reduced) {
      gsap.set([...textOf(i), ...noteOf(i)], { autoAlpha: 1, y: 0 })
      return
    }
    if (wasHidden) {
      gsap.to(textOf(i), { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.085 })
      gsap.to(noteOf(i), { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.35 })
    }
    gsap.fromTo(artOf(i), { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'expo.out' })
    gsap.fromTo(
      layersOf(i),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.1 },
    )
  }

  const run = () => {
    if (busy.current) return
    const t = targetRef.current
    // a spread we hid for an entrance is no longer the destination — show it
    if (hiddenSpread.current !== null && hiddenSpread.current !== t) {
      gsap.set([...textOf(hiddenSpread.current), ...noteOf(hiddenSpread.current)], { autoAlpha: 1, y: 0 })
      hiddenSpread.current = null
    }
    if (t === cur.current) {
      moving.current = false
      reveal(t)
      settleCb.current?.(t)
      return
    }
    const from = cur.current
    const dir = t > from ? 1 : -1
    const to = from + dir
    const remaining = Math.abs(t - from)
    const phase: Phase = remaining > 1 ? (moving.current ? 'middle' : 'first') : moving.current ? 'last' : 'single'
    moving.current = remaining > 1 || (moving.current && remaining > 0)
    revealed.current = null

    if (dir > 0 && to === t && !reduced) {
      hiddenSpread.current = to
      gsap.set(textOf(to), { autoAlpha: 0, y: 16 })
      gsap.set(noteOf(to), { autoAlpha: 0, y: 8 })
    }

    busy.current = true
    const tl = step(from, to, phase)
    // final page of the journey: let the words arrive as the page lands
    if (to === t) tl.call(() => reveal(to), [], tl.duration() * 0.68)
    tl.eventCallback('onComplete', () => {
      cur.current = to
      busy.current = false
      run()
    })
  }

  useEffect(() => {
    targetRef.current = Math.max(-1, Math.min(N - 1, target))
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, N])

  return (
    <div ref={stageRef} className="book-stage" aria-hidden={false}>
      <div ref={introRef} className="book-float">
        <div ref={floatRef} className="book-float">
          <div ref={bookRef} className="book">
            <div ref={shadowLeftRef} className="book-shadow left" />
            <div className="book-shadow right" />
            <div className="board board-right" />

            <div ref={leftBaseRef} className="page-base base-left">
              <PlatePage project={projects[0]} index={0} />
            </div>
            <div className="page-base base-right">
              <NotesPage project={projects[N - 1]} index={N - 1} />
            </div>

            {projects.slice(0, N - 1).map((p, k) => (
              <div
                key={p.id}
                ref={(el) => {
                  leafRefs.current[k] = el
                }}
                className="leaf"
              >
                <div className="face front">
                  <NotesPage project={p} index={k} />
                </div>
                <div className="face back">
                  <PlatePage project={projects[k + 1]} index={k + 1} />
                </div>
              </div>
            ))}

            <div ref={coverRef} className="leaf cover">
              <div className="face front">
                <CoverFront count={N} />
              </div>
              <div className="face back">
                <CoverBack />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { gsap } from './lib/gsap.js'
import { matches, FINE_POINTER } from './lib/media.js'

/**
 * The two-page CSS-3D journal.
 *
 * Spread i = plate (left) + notes (right) of entry i.
 * Leaf k (0..N-2) carries notes[k] on its front and plate[k+1] on its back.
 * The left base shows plate[0]; the right base shows notes[N-1].
 *
 * GSAP composes transforms as translate → rotate, so a leaf's `z` is its
 * true height above the book; flipping interpolates between the right and
 * left stacks with a lift in the middle, which keeps depth-sorting correct.
 *
 * Returns { setTarget(i), destroy() } — target -1 is the closed book.
 */
export function createBook(stage, { reduced }) {
  const intro = stage.querySelector('[data-book-intro]')
  const float = stage.querySelector('[data-book-tilt]')
  const book = stage.querySelector('.book')
  const cover = book.querySelector('.leaf--cover')
  const leftBase = book.querySelector('.page-base--left')
  const shadowLeft = book.querySelector('.book-shadow--left')
  const leaves = Array.from(book.querySelectorAll('.leaf:not(.leaf--cover)'))
  const N = leaves.length + 1

  let cur = -1
  let busy = false
  let moving = false // inside a multi-page journey
  let target = -1
  let hiddenSpread = null
  let revealed = null
  let timeline = null
  let alive = true

  const E = 0.9 // px between stacked sheets
  const zUnflipped = (k) => (N - 1 - k) * E + E
  const zFlipped = (k) => (k + 1) * E
  const COVER_CLOSED = N * E + E * 2
  const COVER_OPEN = -1.5

  const q = (sel) => Array.from(book.querySelectorAll(sel))
  const textOf = (i) => q(`[data-spread="${i}"][data-side="right"] [data-anim]`)
  const noteOf = (i) => q(`[data-spread="${i}"][data-side="left"] [data-anim]`)
  const artOf = (i) => q(`[data-spread="${i}"][data-side="left"] [data-art-inner]`)
  const layersOf = (i) => q(`[data-spread="${i}"][data-side="left"] [data-layer]`)

  const setEdges = (open) => {
    const flipped = Math.max(0, open)
    const unflipped = N - 1 - flipped
    gsap.to(stage, {
      '--edge-r': `${3 + unflipped * 1.4}px`,
      '--edge-l': `${3 + flipped * 1.4}px`,
      duration: reduced ? 0 : 0.9,
      ease: 'power2.inOut',
    })
  }

  // ── initial pose
  gsap.set(book, { rotationX: 14, rotationZ: -1.5, xPercent: -25 })
  leaves.forEach((leaf, k) => gsap.set(leaf, { rotationY: 0, z: zUnflipped(k), '--shade': 0 }))
  gsap.set(cover, { rotationY: 0, z: COVER_CLOSED, '--shade': 0 })
  gsap.set([leftBase, shadowLeft], { autoAlpha: 0 })
  setEdges(-1)

  // ── book floats up as it scrolls into view; gentle pointer tilt
  const introCtx = gsap.context(() => {
    if (!reduced) {
      gsap.from(intro, {
        y: 90,
        rotationX: 22,
        autoAlpha: 0,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: stage, start: 'top 85%', once: true },
      })
    }
  })
  let removePointer = () => {}
  if (!reduced && matches(FINE_POINTER)) {
    const rx = gsap.quickTo(float, 'rotationX', { duration: 1.6, ease: 'power3.out' })
    const ry = gsap.quickTo(float, 'rotationY', { duration: 1.6, ease: 'power3.out' })
    const move = (e) => {
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
    removePointer = () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
    }
  }

  // ── one step of the page engine
  // A journey across several pages is one continuous motion: it accelerates
  // into the first leaf, glides through the middle ones at an even pace and
  // eases into the last — no stop-start between pages.
  const TIMING = {
    single: { dur: 1.35, ease: 'power3.inOut' },
    first: { dur: 0.6, ease: 'power2.in' },
    middle: { dur: 0.42, ease: 'none' },
    last: { dur: 0.85, ease: 'power3.out' },
  }

  const step = (from, to, phase) => {
    const { dur: d, ease } = TIMING[phase]
    const dur = reduced ? 0.001 : d
    const forward = to > from
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
    const lift = (book.offsetWidth / 2) * 0.12

    let el, z0, z1
    if (from === -1 || to === -1) {
      el = cover
      z0 = COVER_CLOSED
      z1 = COVER_OPEN
    } else {
      const k = forward ? from : to
      el = leaves[k]
      z0 = zUnflipped(k)
      z1 = zFlipped(k)
    }

    const proxy = { t: forward ? 0 : 1 }
    const isCover = el === cover
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
          if (isCover) gsap.set(leftBase, { autoAlpha: t > 0.5 ? 1 : 0 })
        },
      },
      0,
    )

    if (isCover) {
      tl.to(book, { xPercent: forward ? 0 : -25, duration: dur, ease: 'power3.inOut' }, 0)
      tl.to(shadowLeft, { autoAlpha: forward ? 1 : 0, duration: dur * 0.6 }, forward ? dur * 0.4 : 0)
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

  const reveal = (i) => {
    if (i < 0 || revealed === i) return
    revealed = i
    const wasHidden = hiddenSpread === i
    hiddenSpread = null
    if (reduced) {
      gsap.set([...textOf(i), ...noteOf(i)], { autoAlpha: 1, y: 0 })
      return
    }
    if (wasHidden) {
      gsap.to(textOf(i), { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.085 })
      gsap.to(noteOf(i), { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.35 })
    }
    gsap.fromTo(artOf(i), { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'expo.out' })
    gsap.fromTo(layersOf(i), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.1 })
  }

  const run = () => {
    if (busy || !alive) return
    const t = target
    // a spread we hid for an entrance is no longer the destination — show it
    if (hiddenSpread !== null && hiddenSpread !== t) {
      gsap.set([...textOf(hiddenSpread), ...noteOf(hiddenSpread)], { autoAlpha: 1, y: 0 })
      hiddenSpread = null
    }
    if (t === cur) {
      moving = false
      reveal(t)
      return
    }
    const from = cur
    const dir = t > from ? 1 : -1
    const to = from + dir
    const remaining = Math.abs(t - from)
    const phase = remaining > 1 ? (moving ? 'middle' : 'first') : moving ? 'last' : 'single'
    moving = remaining > 1 || (moving && remaining > 0)
    revealed = null

    if (dir > 0 && to === t && !reduced) {
      hiddenSpread = to
      gsap.set(textOf(to), { autoAlpha: 0, y: 16 })
      gsap.set(noteOf(to), { autoAlpha: 0, y: 8 })
    }

    busy = true
    const tl = step(from, to, phase)
    timeline = tl
    // final page of the journey: let the words arrive as the page lands
    if (to === t) tl.call(() => reveal(to), [], tl.duration() * 0.68)
    tl.eventCallback('onComplete', () => {
      cur = to
      busy = false
      timeline = null
      run()
    })
  }

  return {
    setTarget(i) {
      const next = Math.max(-1, Math.min(N - 1, i))
      if (next === target) return
      target = next
      run()
    },
    destroy() {
      alive = false
      timeline?.kill()
      removePointer()
      introCtx.revert()
      const animated = [stage, intro, float, book, cover, leftBase, shadowLeft, ...leaves, ...q('[data-anim],[data-art-inner],[data-layer]')]
      gsap.killTweensOf(animated)
      gsap.set(animated, { clearProps: 'all' })
    },
  }
}

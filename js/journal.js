import { gsap, ScrollTrigger } from './lib/gsap.js'
import { getLenis, scrollToTarget } from './lib/scroll.js'
import { matches, onMedia, WIDE_JOURNAL } from './lib/media.js'
import { createBook } from './journal-book.js'
import { createMobileJournal } from './journal-mobile.js'

const STEP_VH = 0.75 // scroll distance per page turn, in viewport heights
const pad = (n) => String(n).padStart(2, '0')

/**
 * Chapter III — the journal.
 * Wide screens: the page is pinned and the scroll position chooses the spread
 * of the 3D book. Smaller screens: a single-page journal you swipe through.
 */
export function initJournal(reduced) {
  const section = document.querySelector('#work')
  if (!section) return

  const bookStage = section.querySelector('[data-journal-book]')
  const mobileStage = section.querySelector('[data-journal-mobile]')
  const prevBtn = section.querySelector('[data-journal-prev]')
  const nextBtn = section.querySelector('[data-journal-next]')
  const caption = section.querySelector('[data-journal-caption]')
  const [captionMeta, captionTitle] = caption.children
  const openNumber = section.querySelector('[data-journal-open]')
  const titleWide = section.querySelector('[data-journal-title-wide]')
  const titleMobile = section.querySelector('[data-journal-title-mobile]')
  const dots = Array.from(section.querySelectorAll('[role="tab"]'))
  const entries = dots.map((d) => {
    const [title, category] = d.getAttribute('aria-label').split(' — ')
    return { title, category }
  })
  const N = entries.length
  const STATES = N + 1 // closed + one per spread

  let wide = false
  let target = -1 // desktop: -1 closed
  let mobileIndex = 0
  let shown = null // the entry the controls currently describe
  let trigger = null
  let book = null
  let mobile = null

  const active = () => (wide ? target : mobileIndex)

  // ── controls, caption and side notes follow the open entry
  const render = () => {
    const a = active()
    const current = a >= 0 ? entries[a] : null
    prevBtn.disabled = a <= (wide ? -1 : 0)
    nextBtn.disabled = a >= N - 1
    nextBtn.setAttribute('aria-label', a === -1 ? 'Open the journal' : 'Next page')
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === a)))
    captionMeta.textContent = current ? `${pad(a + 1)} / ${pad(N)} — ${current.category}` : `${pad(N)} entries inside`
    captionTitle.textContent = current ? current.title : wide ? 'Scroll to open the journal' : ''
    openNumber.textContent = current ? pad(a + 1) : '—'

    // the caption under the book cross-fades when the spread changes
    if (a !== shown) {
      shown = a
      if (!reduced) {
        gsap.fromTo(caption.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 })
      }
    }
  }

  const setTarget = (t) => {
    if (t === target) return
    target = t
    book?.setTarget(t)
    render()
  }

  const setMobileIndex = (i) => {
    const next = Math.max(0, Math.min(N - 1, i))
    if (next === mobileIndex) return
    mobileIndex = next
    mobile?.setIndex(next)
    render()
  }

  /** Travel to a spread by scrolling, so scroll and book never disagree. */
  const goTo = (i) => {
    if (!wide) {
      setMobileIndex(i)
      return
    }
    if (!trigger) return
    const clamped = Math.max(-1, Math.min(N - 1, i))
    const p = (clamped + 1 + 0.5) / STATES
    const y = trigger.start + (trigger.end - trigger.start) * p
    const distance = Math.abs(clamped - target)
    if (getLenis()) scrollToTarget(y, { duration: Math.min(2.4, 0.9 + distance * 0.35) })
    else window.scrollTo({ top: y })
  }

  // ── build one variant, tearing down the other
  const buildWide = () => {
    mobile?.destroy()
    mobile = null
    mobileStage.hidden = true
    bookStage.hidden = false
    titleMobile.removeAttribute('id')
    titleWide.id = 'work-title'

    // pin the page; scroll position chooses the spread
    trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * STEP_VH * (STATES - 1) + window.innerHeight * 0.35}`,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const s = Math.min(STATES - 1, Math.floor(self.progress * STATES * 0.9999))
        setTarget(s - 1)
      },
    })
    book = createBook(bookStage, { reduced })
    book.setTarget(target)
  }

  const buildNarrow = () => {
    trigger?.kill(true) // also unpins the page
    trigger = null
    book?.destroy()
    book = null
    bookStage.hidden = true
    mobileStage.hidden = false
    titleWide.removeAttribute('id')
    titleMobile.id = 'work-title'

    mobile = createMobileJournal(mobileStage, { reduced, index: mobileIndex, onIndex: setMobileIndex })
  }

  const apply = (isWide) => {
    wide = isWide
    if (wide) buildWide()
    else buildNarrow()
    render()
  }

  apply(matches(WIDE_JOURNAL))
  onMedia(WIDE_JOURNAL, (isWide) => {
    if (isWide === wide) return
    apply(isWide)
    ScrollTrigger.refresh()
  })

  // ── buttons and dots
  prevBtn.addEventListener('click', () => goTo(active() - 1))
  nextBtn.addEventListener('click', () => goTo(active() + 1))
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)))

  // arrow keys while the journal fills the screen
  window.addEventListener('keydown', (e) => {
    let inView
    if (wide) inView = !!trigger?.isActive
    else {
      const r = section.getBoundingClientRect()
      inView = r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.5
    }
    if (!inView) return
    if (e.target?.closest?.('input,textarea')) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active() + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active() - 1)
    }
  })
}

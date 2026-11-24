import { gsap } from './lib/gsap.js'

/** Chapter 04 — "Beyond the classroom": the thread draws itself as you read. */
export function initExperience(reduced) {
  const root = document.querySelector('#experience')
  if (!root || reduced) return
  const list = root.querySelector('.xp__list')

  // The thread fills in, scrubbed to the scroll.
  gsap.fromTo(
    root.querySelector('.xp__thread-fill'),
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 55%', scrub: 0.8 },
    },
  )

  // Each entry rises in, and lights its node while it's being read.
  root.querySelectorAll('.xp__row').forEach((row) => {
    gsap.from(row.querySelectorAll('[data-xp-in]'), {
      autoAlpha: 0,
      y: 34,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: row, start: 'top 86%', once: true },
    })
    gsap.to(row, {
      scrollTrigger: { trigger: row, start: 'top 60%', end: 'bottom 40%', toggleClass: 'is-current' },
    })
  })

  // "it started here ↓" / "…and still counting"
  gsap.from(root.querySelectorAll('.xp__mark'), {
    autoAlpha: 0,
    y: 12,
    rotate: -6,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: list, start: 'top 80%', once: true },
  })
}

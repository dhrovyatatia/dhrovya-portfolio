import { gsap } from './lib/gsap.js'

/** Chapter 05 — the learning curve. */
export function initSkills(reduced) {
  const root = document.querySelector('#skills')
  if (!root || reduced) return

  // The outlined index line slides with the scroll, never on its own.
  gsap.fromTo(
    root.querySelector('.skills__ticker'),
    { xPercent: 0 },
    {
      xPercent: -35,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    },
  )

  // Entries in each column arrive one after another.
  root.querySelectorAll('.skills__col').forEach((col, i) => {
    gsap.from(col.querySelectorAll('.skills__item'), {
      autoAlpha: 0,
      x: -14,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.06,
      delay: i * 0.08,
      scrollTrigger: { trigger: col, start: 'top 82%', once: true },
    })
  })
}

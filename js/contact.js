import { gsap } from './lib/gsap.js'
import { scrollToTarget } from './lib/scroll.js'

/** Chapter 07 — the last page, the copy-email button and the footer. */
export function initContact(reduced) {
  const section = document.querySelector('#contact')
  if (!section) return

  // Copy the email address; fall back to opening the mail app.
  const copy = section.querySelector('[data-copy]')
  const label = copy?.querySelector('.contact__copy-label')
  let timer = 0
  copy?.addEventListener('click', async () => {
    const email = copy.dataset.copy
    try {
      await navigator.clipboard.writeText(email)
      copy.classList.add('is-copied')
      label.textContent = 'Copied'
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        copy.classList.remove('is-copied')
        label.textContent = 'Copy'
      }, 2200)
    } catch {
      window.location.href = `mailto:${email}`
    }
  })

  // Footer: this year, and a slow glide back to the first page.
  section.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())))
  section.querySelector('[data-scroll-top]')?.addEventListener('click', () => scrollToTarget(0, { duration: 2.6 }))

  if (reduced) return

  // As the back cover comes into view, the last page settles down onto it.
  gsap.fromTo(
    section.querySelector('.contact__page'),
    { rotationX: 0, transformPerspective: 2000, transformOrigin: '50% 100%' },
    {
      rotationX: 3,
      scale: 0.985,
      ease: 'none',
      scrollTrigger: { trigger: section.querySelector('.footer'), start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    },
  )
}

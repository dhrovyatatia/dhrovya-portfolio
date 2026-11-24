/**
 * Dhrovya Tatia — a personal journal.
 * The page itself is plain HTML + CSS; these scripts add the motion.
 */
import { ScrollTrigger } from './lib/gsap.js'
import { reducedMotion } from './lib/media.js'
import { initSmoothScroll } from './smooth-scroll.js'
import { initReveals } from './reveal.js'
import { initWater } from './water.js'
import { initNav } from './nav.js'
import { initHero } from './hero.js'
import { initJournal } from './journal.js'
import { initExperience } from './experience.js'
import { initSkills } from './skills.js'
import { initHobbies } from './hobbies.js'
import { initContact } from './contact.js'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

const reduced = reducedMotion()

// Sections first (pins and section timelines), then the shared reveals,
// then smooth scrolling — the same order the page was designed around.
initWater(reduced)
initNav(reduced)
initHero(reduced)
initJournal(reduced)
initExperience(reduced)
initSkills(reduced)
initHobbies(reduced)
initContact(reduced)
initReveals(document.querySelector('.site-main'), reduced)
initSmoothScroll(!reduced)

// Late layout shifts (fonts, images) → recompute trigger positions once settled.
window.addEventListener('load', () => ScrollTrigger.refresh())
window.setTimeout(() => ScrollTrigger.refresh(), 1200)

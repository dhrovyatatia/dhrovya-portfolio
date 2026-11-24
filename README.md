# dhrovya-portfolio

A personal portfolio website showcasing my background, education, skills, achievements, interests and creative
pursuits. Developed as part of my Midterm Web Development Assignment, with a focus on responsive design, visual
storytelling and interactive user experience.

Designed as an editorial journal floating on a deep emerald pond.
**HTML · CSS · JavaScript** (one TypeScript module) · GSAP (ScrollTrigger, SplitText) · Lenis · WebGL, bundled with Vite.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into /dist
npm run preview   # serve the build
```

## How it's put together

```
index.html            the whole page: every chapter is plain, semantic HTML
css/
  main.css            imports the fonts and every stylesheet below, in page order
  base.css            design tokens (custom properties), reset, typography, buttons, chapter marks
  textures.css        paper, grain and the shared "paper page" surface
  nav.css             header, liquid-glass tab bar, full-screen phone menu
  hero.css            the opening: water layer, pond, lily pads, koi
  about.css           Chapter 02 — Human behind this
  journal.css         Chapter 03 — the journal section (desktop book + phone journal)
  book.css            the CSS 3D book (perspective, preserve-3d, backface-visibility)
  experience.css      Chapter 04 — Beyond the classroom (timeline)
  skills.css          Chapter 05 — The learning curve
  hobbies.css         Chapter 06 — A life in fragments
  resume.css          the resume sheet (+ resume-print.css for the A4 PDF)
  contact.css         Chapter 07 — Let's connect, and the footer
js/
  main.js             starts everything in order
  glass-tabs.ts       the glass tab bar controller (TypeScript)
  nav.js, hero.js, water.js, journal*.js, experience.js, skills.js, contact.js …
  reveal.js           declarative scroll reveals (data-reveal, data-speed, data-page-enter)
  smooth-scroll.js    Lenis on GSAP's ticker
public/               photos, logo, favicon and the resume PDF
resume.html           print source for the resume PDF
```

All content lives directly in `index.html`. Photos go in `/public` and are referenced by path
(for example `/hobbies/reading.jpg`).

**Updating the resume PDF.** After editing the resume in `resume.html`, keep `npm run dev` running and run
`npm run resume:pdf`. It prints `resume.html` to `public/Dhrovya-Tatia-Resume.pdf` (one A4 page)
using your local Chrome or Edge, and tells you if the content no longer fits on one page.

**Typography.** The display face is Noto Serif Display at its narrowest width (62.5) and
heaviest weight (900), compressed further with `scaleX(var(--sx))`. Change `--sx` in `css/base.css`
to tune it. Block headings use `.t-fit` so they wrap at their visual width.

**Motion.** Respects `prefers-reduced-motion`: no smooth scrolling, no reveals or ambient
loops, instant page turns, static water.

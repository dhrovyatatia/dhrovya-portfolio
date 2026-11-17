# dhrovya-portfolio

A personal portfolio website showcasing my background, education, skills, achievements, interests and creative
pursuits. Developed as part of my Midterm Web Development Assignment, with a focus on responsive design, visual
storytelling and interactive user experience.

Designed as an editorial journal floating on a deep emerald pond.
React · TypeScript · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText, MotionPath) · Lenis · WebGL.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into /dist
npm run preview   # serve the build
```

## Editing your content

All words, links and projects live in `src/data/`. Text in `[square brackets]` is a placeholder.

| File | What it controls |
| --- | --- |
| `site.ts` | Name, monogram, hero statement, intro note, email, socials, About page entries, portrait |
| `projects.ts` | The journal spreads (one per project): title, category, description, role, technologies, year, link, margin note |
| `experience.ts` | "Where I've been" timeline entries |
| `skills.ts` | "Things I work with" — a **starter list**; keep only what's true for you |
| `experiments.ts` | "A life in fragments" — the hobbies collage (photos in `/public/hobbies`) |
| `resume.ts` | The resume shown under the hobbies, and the downloadable PDF |

**Updating the resume PDF.** After editing `resume.ts`, keep `npm run dev` running and run
`npm run resume:pdf`. It prints `resume.html` to `public/Dhrovya-Tatia-Resume.pdf` (one A4 page)
using your local Chrome or Edge, and tells you if the content no longer fits on one page.

**Images.** Put files in `/public` and reference them by path:
- portrait → `about.portrait = '/portrait.jpg'`
- a project plate → `image: '/work/project-01.jpg'` (portrait-ish crops work best, ~4:5)
- an experiment → `image: '/lab/study-01.jpg'`

Without an image, each item draws a procedural illustration in the site palette.

The journal adapts to any number of projects (each adds one page turn).

## How it's put together

```
src/
  data/                content only
  components/
    Navigation.tsx     theme-aware bar + full-page menu
    Hero.tsx           Chapter 01 — the opening sequence
    About.tsx          Chapter 02
    ChapterMark.tsx    open-water interludes between pages
    journal/
      JournalShowcase  Chapter 03 — pinned section, scroll ⇄ spread mapping, controls
      Book.tsx         CSS-3D two-page book + GSAP page-turn engine (desktop, lazy)
      MobileJournal    single-page, swipeable journal (touch / narrow, lazy)
      ProjectPages     plate (left) and notes (right) page layouts, cover
      ProjectArt       procedural project plates
    Experience.tsx     Chapter 04 — timeline
    Skills.tsx         Chapter 05 — the toolbox
    Experiments.tsx    Chapter 06 — the lab
    Contact.tsx        Chapter 07 — last page on the back cover (+ Footer)
    water/             WebGL pond shader (lazy) + shared state for GSAP
    organic/           lily pads, lotus, koi, botanical line drawings (SVG)
  hooks/
    useSmoothScroll    Lenis on GSAP's ticker
    useScrollAnimations  declarative data-reveal / data-speed / data-page-enter
    useGsap            scoped gsap.context helper
  styles/              tokens & type, paper textures, page + book CSS, ambient loops
```

**Typography.** The display face is Noto Serif Display at its narrowest width (62.5) and
heaviest weight (900), compressed further with `scaleX(var(--sx))` for the tall PERCH
proportions. Change `--sx` in `src/styles/index.css` to tune it. Block headings use `.t-fit`
so they wrap at their visual width.

**Motion.** Respects `prefers-reduced-motion`: no smooth scrolling, no reveals or ambient
loops, instant page turns, static water.

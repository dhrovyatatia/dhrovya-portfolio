import { lazy, Suspense, useEffect, useRef } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { useReducedMotion } from './hooks/useMedia'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useScrollAnimations } from './hooks/useScrollAnimations'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { ChapterMark } from './components/ChapterMark'
import { JournalShowcase } from './components/journal/JournalShowcase'
import { Experience } from './components/Experience'
import { Skills } from './components/Skills'
import { Experiments } from './components/Experiments'
import { Contact } from './components/Contact'
import { projects } from './data/projects'

const WaterBackground = lazy(() => import('./components/water/WaterBackground'))

export default function App() {
  const reduced = useReducedMotion()
  const main = useRef<HTMLElement>(null)

  useSmoothScroll(!reduced)
  useScrollAnimations(main, reduced)

  // Late layout shifts (fonts, lazy chunks) → recompute trigger positions once settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = window.setTimeout(refresh, 1200)
    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(t)
    }
  }, [])

  return (
    <>
      <Suspense fallback={<div aria-hidden className="water-fallback fixed inset-0 z-0" />}>
        <WaterBackground reduced={reduced} />
      </Suspense>
      <div aria-hidden className="grain-overlay" />

      <Navigation reduced={reduced} />

      <main ref={main} className="relative">
        <Hero reduced={reduced} />
        <About />
        <ChapterMark
          numeral="III"
          title="The journal"
          kicker={`${projects.length} entries, bound in green cloth. Open it slowly.`}
          side="right"
        />
        <JournalShowcase reduced={reduced} />
        <Experience reduced={reduced} />
        <Skills reduced={reduced} />
        <Experiments />
        <ChapterMark numeral="VII" title="The last page" kicker="Every good journal ends with an invitation." side="left" />
        <Contact reduced={reduced} />
      </main>
    </>
  )
}

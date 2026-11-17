import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Runs GSAP code inside a scoped gsap.context and reverts everything
 * (tweens, ScrollTriggers, SplitTexts) on cleanup. Layout-effect timing
 * means initial "from" states are applied before first paint.
 */
export function useGsap(
  fn: (ctx: gsap.Context) => void | (() => void),
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return
    let extraCleanup: void | (() => void)
    const ctx = gsap.context((self) => {
      extraCleanup = fn(self)
    }, scope.current)
    return () => {
      if (typeof extraCleanup === 'function') extraCleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

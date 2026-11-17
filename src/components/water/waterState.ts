/**
 * Mutable state the water shader reads every frame. GSAP tweens these
 * values directly (e.g. the cinematic reveal) — no React re-renders.
 */
export const waterState = {
  /** 0 = still black-green depths, 1 = full reflections and light */
  reveal: 0,
  /** extra brightness of the light patches, used for subtle emphasis */
  glow: 1,
}

type Ripple = { x: number; y: number; t: number; s: number }
export const ripples: Ripple[] = []

/** Queue a soft ripple at viewport coordinates. */
export function addRipple(clientX: number, clientY: number, strength = 1) {
  ripples.push({ x: clientX, y: clientY, t: performance.now() / 1000, s: strength })
  if (ripples.length > 4) ripples.shift()
}

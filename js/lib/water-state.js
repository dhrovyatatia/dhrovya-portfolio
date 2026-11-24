/**
 * Mutable state the water shader reads every frame. GSAP tweens these
 * values directly (e.g. the cinematic reveal in the hero).
 */
export const waterState = {
  /** 0 = still black-green depths, 1 = full reflections and light */
  reveal: 0,
  /** extra brightness of the light patches, used for subtle emphasis */
  glow: 1,
}

/** Up to four live ripples: { x, y, t, s } in viewport px, birth time (s), strength */
export const ripples = []

/** Queue a soft ripple at viewport coordinates. */
export function addRipple(clientX, clientY, strength = 1) {
  ripples.push({ x: clientX, y: clientY, t: performance.now() / 1000, s: strength })
  if (ripples.length > 4) ripples.shift()
}

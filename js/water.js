import { vertexShader, fragmentShader } from './water-shader.js'
import { waterState, ripples, addRipple } from './lib/water-state.js'

// Ripples only where the pointer touches open water, never on paper or controls.
const PAPER = '.paper, .paper-warm, .journal-page, .lab__sheet, .book-stage, nav, button, a'

/**
 * Fixed, full-viewport WebGL pond that lives behind every section.
 * Rendered at a reduced internal resolution — the surface is soft by nature,
 * so this costs very little visually and saves a lot of fill-rate.
 * If WebGL is unavailable the CSS gradient (.water-fallback) stays visible.
 */
export function initWater(reduced) {
  const canvas = document.querySelector('.water__canvas')
  if (!canvas) return
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  if (!gl) {
    canvas.remove()
    return
  }

  const compile = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s))
      return null
    }
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, vertexShader)
  const fs = compile(gl.FRAGMENT_SHADER, fragmentShader)
  if (!vs || !fs) {
    canvas.remove()
    return
  }
  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.remove()
    return
  }
  gl.useProgram(prog)

  // one oversized triangle covers the viewport
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const u = {
    res: gl.getUniformLocation(prog, 'uRes'),
    time: gl.getUniformLocation(prog, 'uTime'),
    reveal: gl.getUniformLocation(prog, 'uReveal'),
    glow: gl.getUniformLocation(prog, 'uGlow'),
    scroll: gl.getUniformLocation(prog, 'uScroll'),
    ripples: gl.getUniformLocation(prog, 'uRipples'),
  }

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isSmall = window.innerWidth < 768
    const scale = (isSmall ? 0.45 : 0.55) * Math.min(dpr, 1.5)
    const w = Math.max(2, Math.round(window.innerWidth * scale))
    const h = Math.max(2, Math.round(window.innerHeight * scale))
    canvas.width = w
    canvas.height = h
    gl.viewport(0, 0, w, h)
    gl.uniform2f(u.res, w, h)
  }
  resize()

  const rippleData = new Float32Array(16)
  const start = performance.now() / 1000
  let raf = 0
  let running = true

  const draw = () => {
    const now = performance.now() / 1000
    gl.uniform1f(u.time, reduced ? 40 : now - start + 40)
    gl.uniform1f(u.reveal, reduced ? 1 : waterState.reveal)
    gl.uniform1f(u.glow, waterState.glow)
    gl.uniform1f(u.scroll, window.scrollY)
    rippleData.fill(0)
    const vw = window.innerWidth
    const vh = window.innerHeight
    ripples.forEach((r, i) => {
      rippleData[i * 4] = (r.x - vw / 2) / vh
      rippleData[i * 4 + 1] = (vh - r.y - vh / 2) / vh
      rippleData[i * 4 + 2] = r.t - start + 40
      rippleData[i * 4 + 3] = r.s
    })
    gl.uniform4fv(u.ripples, rippleData)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const loop = () => {
    if (!running) return
    draw()
    raf = requestAnimationFrame(loop)
  }

  if (reduced) draw()
  else loop()

  window.addEventListener('resize', () => {
    resize()
    if (reduced) draw()
  })

  // Pause the pond while the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (reduced) return
    if (document.hidden) {
      running = false
      cancelAnimationFrame(raf)
    } else if (!running) {
      running = true
      loop()
    }
  })

  if (reduced) return

  // Soft ripples where the pointer touches open water.
  let lastX = 0
  let lastY = 0
  let lastT = 0
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return
      const now = performance.now()
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      if (now - lastT < 700 || dist < 80) return
      if (e.target?.closest?.(PAPER)) return
      lastX = e.clientX
      lastY = e.clientY
      lastT = now
      addRipple(e.clientX, e.clientY, 0.55)
    },
    { passive: true },
  )
  window.addEventListener(
    'pointerdown',
    (e) => {
      if (e.target?.closest?.(PAPER)) return
      addRipple(e.clientX, e.clientY, 1)
    },
    { passive: true },
  )
}

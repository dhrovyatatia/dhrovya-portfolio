import { useEffect, useRef, useState } from 'react'
import { vertexShader, fragmentShader } from './waterShader'
import { waterState, ripples, addRipple } from './waterState'

interface Props {
  reduced: boolean
}

const PAPER = '.paper, .paper-warm, .lab-sheet, .book-stage, nav, button, a'

/**
 * Fixed, full-viewport WebGL pond that lives behind every section.
 * Rendered at a reduced internal resolution — the surface is soft by nature,
 * so this costs very little visually and saves a lot of fill-rate.
 */
export default function WaterBackground({ reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) {
      setFailed(true)
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
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
      setFailed(true)
      return
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true)
      return
    }
    gl.useProgram(prog)

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

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const isSmall = window.innerWidth < 768
      const scale = (isSmall ? 0.45 : 0.55) * Math.min(dpr, 1.5)
      w = Math.max(2, Math.round(window.innerWidth * scale))
      h = Math.max(2, Math.round(window.innerHeight * scale))
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
      const time = reduced ? 40 : now - start + 40
      gl.uniform1f(u.time, time)
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

    const onResize = () => {
      resize()
      if (reduced) draw()
    }
    window.addEventListener('resize', onResize)

    const onVisibility = () => {
      if (reduced) return
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        loop()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Soft ripples where the pointer touches open water.
    let lastX = 0
    let lastY = 0
    let lastT = 0
    const onMove = (e: PointerEvent) => {
      if (reduced || e.pointerType !== 'mouse') return
      const now = performance.now()
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY)
      if (now - lastT < 700 || dist < 80) return
      if ((e.target as Element)?.closest?.(PAPER)) return
      lastX = e.clientX
      lastY = e.clientY
      lastT = now
      addRipple(e.clientX, e.clientY, 0.55)
    }
    const onDown = (e: PointerEvent) => {
      if (reduced) return
      if ((e.target as Element)?.closest?.(PAPER)) return
      addRipple(e.clientX, e.clientY, 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    }
  }, [reduced])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 water-fallback">
      {!failed && <canvas ref={canvasRef} className="block h-full w-full" />}
    </div>
  )
}

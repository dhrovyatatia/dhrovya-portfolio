/**
 * Hand-drawn style line illustrations. Each uses only strokes so the
 * scroll system can "draw" them in (data-reveal="draw").
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Side view: lotus bud, stem and a curled pad — for the About page */
export function LotusSketch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 300" className={className} data-reveal="draw" aria-hidden>
      {/* water line */}
      <path {...stroke} d="M8 236 C40 232 70 240 110 236 C150 232 180 240 212 236" strokeOpacity="0.6" />
      <path {...stroke} d="M30 250 C60 247 80 252 104 249" strokeOpacity="0.35" />
      <path {...stroke} d="M128 252 C150 249 170 254 196 251" strokeOpacity="0.35" />
      {/* stem */}
      <path {...stroke} d="M112 236 C108 200 118 170 112 132" />
      {/* bud */}
      <path {...stroke} d="M112 132 C94 120 92 92 112 60 C132 92 130 120 112 132 Z" />
      <path {...stroke} d="M112 132 C100 116 102 92 112 74" />
      <path {...stroke} d="M112 132 C124 116 122 92 112 74" />
      <path {...stroke} d="M112 130 C88 128 78 112 80 92 C94 100 104 114 112 130" />
      <path {...stroke} d="M112 130 C136 128 146 112 144 92 C130 100 120 114 112 130" />
      {/* floating pad, in perspective */}
      <path {...stroke} d="M40 232 C30 220 52 206 92 206 C116 206 130 212 120 220 L104 224 L126 228 C122 236 70 240 40 232 Z" />
      <path {...stroke} d="M70 222 L50 214 M74 223 L68 210 M80 224 L88 208" strokeOpacity="0.5" />
      {/* curled young leaf */}
      <path {...stroke} d="M150 236 C150 210 164 196 184 196 C196 196 200 206 192 212 C184 218 170 212 172 204" />
      <path {...stroke} d="M150 236 C156 222 168 214 182 210" strokeOpacity="0.5" />
      {/* dragonfly, tiny */}
      <path {...stroke} d="M168 70 L190 58" />
      <path {...stroke} d="M178 64 C172 52 182 48 184 60 M180 63 C190 56 194 64 182 66" strokeOpacity="0.7" />
    </svg>
  )
}

/** Hand-drawn arrow for annotations */
export function SketchArrow({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      data-reveal="draw"
      aria-hidden
    >
      <path {...stroke} strokeWidth={1.3} d="M6 50 C30 54 70 46 92 18" />
      <path {...stroke} strokeWidth={1.3} d="M80 20 L93 16 L95 30" />
    </svg>
  )
}

/** Small sprig used as a section ornament */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className} aria-hidden>
      <path {...stroke} d="M4 30 C24 26 50 22 76 10" />
      <path {...stroke} d="M22 27 C20 18 26 12 32 12 C32 20 28 25 22 27 Z" />
      <path {...stroke} d="M40 23 C42 14 50 10 56 12 C52 20 46 23 40 23 Z" />
      <path {...stroke} d="M30 26 C34 32 42 34 48 32 C42 28 36 26 30 26 Z" />
      <circle cx="76" cy="10" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

import type { ProjectArtKind } from '../../data/projects'
import { LilyPad } from '../organic/LilyPad'

/**
 * Illustrated plates for each journal entry, drawn in the site palette.
 * Replace with real imagery by setting `image` on an entry.
 * Elements marked data-layer drift independently when a spread opens.
 */
export function ProjectArt({ kind }: { kind: ProjectArtKind }) {
  switch (kind) {
    case 'strategy':
      return <Strategy />
    case 'finance':
      return <Finance />
    case 'leadership':
      return <Leadership />
    case 'creative':
      return <Creative />
    case 'tools':
      return <Tools />
  }
}

const VB = '0 0 300 380'

/** A drifting layer. GSAP owns the outer group's transform, so placement lives on the inner one. */
function L({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <g data-layer>
      <g transform={t}>{children}</g>
    </g>
  )
}
const SANS = 'Instrument Sans Variable, sans-serif'
const HAND = 'Caveat Variable, cursive'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const DISPLAY = { fontStretch: '62.5%', fontVariationSettings: "'wdth' 62.5, 'wght' 900" } as const

/* 01 — Strategy & research: a topographic market map, dots joined into a route */
function Strategy() {
  const dots: [number, number][] = [
    [48, 92], [92, 64], [242, 54], [262, 196], [70, 186], [118, 250], [212, 286],
    [252, 326], [38, 268], [150, 344], [230, 120], [104, 140], [272, 252], [176, 210],
  ]
  // the chosen route — start bottom-left, through the insights, to the target
  const route = 'M52 330 C70 300 96 284 118 250 S 150 214 176 210 S 196 160 186 132'
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="st-bg" cx="62%" cy="32%" r="85%">
          <stop offset="0%" stopColor="#1f5a44" />
          <stop offset="55%" stopColor="#0f3d30" />
          <stop offset="100%" stopColor="#071d17" />
        </radialGradient>
      </defs>
      <rect width="300" height="380" fill="url(#st-bg)" />

      {/* contour lines */}
      <g data-layer fill="none" stroke="#aab7a5" strokeOpacity="0.22" strokeWidth="0.7">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const r = 22 + i * 24
          return (
            <path
              key={i}
              d={`M${186 - r} 132 C${186 - r} ${132 - r * 0.9} ${186 + r * 1.1} ${132 - r * 1.05} ${186 + r} ${132 - r * 0.1} S ${186 + r * 0.4} ${132 + r * 1.1} ${186 - r * 0.2} ${132 + r * 0.95} S ${186 - r} ${132 + r * 0.5} ${186 - r} 132 Z`}
            />
          )
        })}
      </g>

      {/* compass */}
      <g transform="translate(46 44)" stroke="#f3f0e3" strokeOpacity="0.55" fill="none">
        <circle r="17" strokeWidth="0.7" />
        <path d="M0 -24 L0 24 M-24 0 L24 0" strokeWidth="0.5" strokeOpacity="0.3" />
        <path d="M0 -13 L4 0 L0 13 L-4 0 Z" fill="#f3f0e3" fillOpacity="0.5" strokeWidth="0" />
        <text y="-28" textAnchor="middle" fontFamily={SANS} fontSize="7" letterSpacing="1" fill="#f3f0e3" stroke="none">
          N
        </text>
      </g>

      {/* scattered observations */}
      <g data-layer>
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3.2 : 2.2} fill="#f3f0e3" opacity={i % 3 === 0 ? 0.85 : 0.45} />
        ))}
      </g>

      {/* the route */}
      <g data-layer>
        <path d={route} fill="none" stroke="#f3f0e3" strokeWidth="1.4" strokeDasharray="1 6" strokeLinecap="round" />
        {[[52, 330], [118, 250], [176, 210]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#092f25" stroke="#f3f0e3" strokeWidth="1.2" />
            <text x={x + 10} y={y + 3} fontFamily={SANS} fontSize="7" letterSpacing="1.4" fill="#aab7a5">
              {['START', 'INSIGHT', 'EDGE'][i]}
            </text>
          </g>
        ))}
        {/* target */}
        <g transform="translate(186 132)">
          <circle r="26" fill="none" stroke="#91c65a" strokeOpacity="0.35" />
          <circle r="16" fill="none" stroke="#91c65a" strokeOpacity="0.6" />
          <circle r="6.5" fill="#91c65a" />
          <path d="M0 -36 V-22 M0 22 V36 M-36 0 H-22 M22 0 H36" stroke="#91c65a" strokeWidth="1" />
        </g>
        <text x="196" y="88" fontFamily={HAND} fontSize="17" fill="#91c65a">
          the market
        </text>
      </g>
    </svg>
  )
}

/* 02 — Finance & analysis: candles climbing a ruled ledger, a stack of coins */
function Finance() {
  // [open, close, high, low] in chart units (0 = bottom, 100 = top)
  const candles = [
    [22, 30, 34, 18], [30, 26, 33, 22], [26, 36, 40, 24], [36, 33, 41, 29], [33, 44, 48, 31],
    [44, 41, 49, 37], [41, 53, 57, 39], [53, 50, 58, 46], [50, 62, 66, 48], [62, 72, 77, 59], [72, 84, 90, 69],
  ]
  const y = (v: number) => 300 - v * 2.3
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="fi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#174e3d" />
          <stop offset="100%" stopColor="#082a21" />
        </linearGradient>
        <linearGradient id="fi-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#91c65a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#91c65a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="300" height="380" fill="url(#fi-bg)" />

      {/* ledger rules */}
      <g stroke="#aab7a5" strokeOpacity="0.14" strokeWidth="0.6">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="28" x2="282" y1={70 + i * 33} y2={70 + i * 33} />
        ))}
        <line x1="28" x2="28" y1="56" y2="304" strokeOpacity="0.35" />
      </g>

      {/* trend area */}
      <path
        data-layer
        d={`M44 ${y(24)} ${candles.map((c, i) => `L${44 + i * 22} ${y((c[0] + c[1]) / 2)}`).join(' ')} L264 300 L44 300 Z`}
        fill="url(#fi-area)"
      />

      {/* candles */}
      <g data-layer>
        {candles.map(([o, c, h, l], i) => {
          const x = 44 + i * 22
          const up = c >= o
          const last = i === candles.length - 1
          const col = last ? '#91c65a' : up ? '#f3f0e3' : '#aab7a5'
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(h)} y2={y(l)} stroke={col} strokeOpacity={up ? 0.8 : 0.6} strokeWidth="1" />
              <rect
                x={x - 5}
                y={y(Math.max(o, c))}
                width="10"
                height={Math.max(3, Math.abs(c - o) * 2.3)}
                rx="1"
                fill={up ? col : 'none'}
                stroke={col}
                strokeWidth="1"
              />
            </g>
          )
        })}
        <path
          d={`M44 ${y(30)} C110 ${y(36)} 170 ${y(56)} 264 ${y(92)}`}
          fill="none"
          stroke="#91c65a"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      </g>

      {/* coins */}
      <L t="translate(208 326)">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(0 ${-i * 7})`}>
            <ellipse cx="0" cy="6" rx="26" ry="8" fill="#c9c0a6" />
            <rect x="-26" y="0" width="52" height="6" fill="#c9c0a6" />
            <ellipse cx="0" cy="0" rx="26" ry="8" fill="#e8e1cf" stroke="#092f25" strokeOpacity="0.25" />
          </g>
        ))}
        <ellipse cx="0" cy="-28" rx="15" ry="4.4" fill="none" stroke="#092f25" strokeOpacity="0.3" />
      </L>
      <L t="translate(150 334) rotate(-24)">
        <ellipse cx="0" cy="3" rx="16" ry="16" fill="#c9c0a6" />
        <circle r="16" fill="#e8e1cf" stroke="#092f25" strokeOpacity="0.25" />
        <circle r="11" fill="none" stroke="#092f25" strokeOpacity="0.3" />
        <text y="5.5" textAnchor="middle" fontFamily={SANS} fontWeight="600" fontSize="15" fill="#092f25">
          ₹
        </text>
      </L>
      <text x="40" y="42" fontFamily={SANS} fontSize="7" letterSpacing="2" fill="#aab7a5">
        P / L — RISK — RETURN
      </text>
    </svg>
  )
}
const DISPLAY_FONT = 'Noto Serif Display Variable, serif'

/* 03 — Words & leadership: a committee hemicycle, the chair, and the floor */
function Leadership() {
  const cx = 150
  const cy = 250
  const rows = [
    { r: 62, n: 7 },
    { r: 82, n: 9 },
    { r: 102, n: 11 },
    { r: 122, n: 13 },
    { r: 142, n: 15 },
  ]
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="300" height="380" fill="#e8e1cf" />
      <g stroke="#477b50" strokeOpacity="0.16" strokeWidth="0.6">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1="0" x2="300" y1={30 + i * 40} y2={30 + i * 40} />
        ))}
      </g>

      {/* delegates */}
      <g data-layer>
        {rows.map(({ r, n }, ri) =>
          Array.from({ length: n }, (_, i) => {
            const a = Math.PI + (i / (n - 1)) * Math.PI
            const x = cx + r * Math.cos(a)
            const yy = cy + r * Math.sin(a)
            const raised = (ri === 2 && i === 3) || (ri === 4 && i === 11) || (ri === 1 && i === 6)
            return (
              <g key={`${ri}-${i}`}>
                <circle cx={x} cy={yy} r="4.2" fill={raised ? '#477b50' : '#092f25'} opacity={raised ? 1 : 0.82} />
                {raised && <line x1={x + 3} y1={yy - 3} x2={x + 7} y2={yy - 13} stroke="#477b50" strokeWidth="1.6" strokeLinecap="round" />}
              </g>
            )
          }),
        )}
      </g>

      {/* the chair */}
      <g data-layer>
        <path d={`M${cx - 18} ${cy + 4} h36 l-5 30 h-26 Z`} fill="#092f25" />
        <rect x={cx - 22} y={cy} width="44" height="5" rx="1.5" fill="#092f25" />
        <circle cx={cx} cy={cy - 13} r="8" fill="#91c65a" />
        {[18, 30, 42].map((r, i) => (
          <path
            key={r}
            d={`M${cx - r * 0.7} ${cy - 13 - r * 0.7} A${r} ${r} 0 0 1 ${cx + r * 0.7} ${cy - 13 - r * 0.7}`}
            fill="none"
            stroke="#91c65a"
            strokeWidth="1.3"
            strokeOpacity={0.9 - i * 0.25}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* the floor speaks */}
      <g data-layer>
        <g transform="translate(34 40)">
          <rect width="96" height="40" rx="20" fill="#092f25" />
          <path d="M22 38 l-6 14 l16 -12 Z" fill="#092f25" />
          <rect x="20" y="15" width="56" height="3.4" rx="1.7" fill="#f3f0e3" opacity="0.8" />
          <rect x="20" y="23" width="38" height="3.4" rx="1.7" fill="#f3f0e3" opacity="0.5" />
        </g>
        <g transform="translate(176 66)">
          <rect width="90" height="36" rx="18" fill="none" stroke="#092f25" strokeWidth="1.2" />
          <path d="M66 35 l8 13 l-1 -13" fill="#e8e1cf" stroke="#092f25" strokeWidth="1.2" strokeLinejoin="round" />
          <text x="45" y="23" textAnchor="middle" fontFamily={HAND} fontSize="16" fill="#092f25">
            point of order!
          </text>
        </g>
      </g>
      <text x="150" y="330" textAnchor="middle" fontFamily={SANS} fontSize="7" letterSpacing="2.4" fill="#477b50">
        THE CHAIR RECOGNISES THE FLOOR
      </text>
    </svg>
  )
}

/* 04 — The creative side: a storyboard sheet and a pencil mid-thought */
function Creative() {
  const panels = [0, 1, 2, 3, 4, 5]
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="cr-bg" cx="40%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#1b5541" />
          <stop offset="100%" stopColor="#082a21" />
        </radialGradient>
      </defs>
      <rect width="300" height="380" fill="url(#cr-bg)" />

      <L t="translate(150 178) rotate(-4) translate(-118 -146)">
        <rect x="4" y="6" width="236" height="292" fill="#071d17" opacity="0.35" />
        <rect width="236" height="292" fill="#f3f0e3" />
        <text x="16" y="22" fontFamily={SANS} fontSize="6.5" letterSpacing="2" fill="#477b50">
          STORYBOARD — SC. 01
        </text>
        {panels.map((i) => {
          const x = 16 + (i % 2) * 108
          const yy = 34 + Math.floor(i / 2) * 84
          return (
            <g key={i} transform={`translate(${x} ${yy})`}>
              <rect width="96" height="62" fill="none" stroke="#092f25" strokeWidth="1" />
              <text x="0" y="74" fontFamily={SANS} fontSize="5.5" letterSpacing="1.4" fill="#477b50">
                {String(i + 1).padStart(2, '0')}
              </text>
              <g fill="none" stroke="#092f25" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                {i === 0 && (
                  <>
                    <circle cx="68" cy="20" r="9" />
                    <path d="M0 52 C20 34 36 34 52 46 C64 38 80 36 96 46" />
                  </>
                )}
                {i === 1 && (
                  <>
                    <circle cx="48" cy="18" r="6" />
                    <path d="M48 24 V42 M48 30 L38 38 M48 30 L60 22 M48 42 L40 56 M48 42 L56 56" />
                    <path d="M62 14 L70 8 M64 20 L74 18" strokeWidth="0.9" />
                  </>
                )}
                {i === 2 && (
                  <>
                    <path d="M18 14 H78 A6 6 0 0 1 84 20 V38 A6 6 0 0 1 78 44 H40 L30 54 L32 44 H18 A6 6 0 0 1 12 38 V20 A6 6 0 0 1 18 14 Z" />
                    <text x="48" y="35" textAnchor="middle" fontFamily={HAND} fontSize="14" fill="#092f25" stroke="none">
                      what if…?
                    </text>
                  </>
                )}
                {i === 3 && (
                  <>
                    {/* caricature: big hair, glasses */}
                    <path d="M30 30 C26 12 42 4 50 8 C58 2 74 10 68 28 C74 32 70 40 66 38" />
                    <ellipse cx="48" cy="36" rx="16" ry="18" />
                    <circle cx="42" cy="34" r="5" />
                    <circle cx="56" cy="34" r="5" />
                    <path d="M47 34 H51 M49 40 C50 44 47 45 46 44 M43 48 C47 50 51 50 54 48" />
                  </>
                )}
                {i === 4 && (
                  <>
                    <path d="M0 40 C16 36 30 44 48 40 C66 36 80 44 96 40" />
                    <ellipse cx="30" cy="46" rx="14" ry="4" />
                    <path d="M62 46 C62 34 70 28 74 30 C72 36 70 42 62 46 Z" />
                    <circle cx="78" cy="14" r="5" fill="#092f25" />
                  </>
                )}
                {i === 5 && (
                  <text x="48" y="38" textAnchor="middle" fontFamily={DISPLAY_FONT} fontWeight="900" fontSize="17" style={DISPLAY} fill="#092f25" stroke="none">
                    THE END?
                  </text>
                )}
              </g>
            </g>
          )
        })}
      </L>

      {/* pencil */}
      <L t="translate(214 300) rotate(-38)">
        <rect x="-8" y="-70" width="16" height="104" fill="#91c65a" />
        <rect x="-8" y="-70" width="5" height="104" fill="#ffffff" opacity="0.18" />
        <rect x="-8" y="-84" width="16" height="14" fill="#aab7a5" />
        <rect x="-8" y="-94" width="16" height="10" rx="3" fill="#e8b7a8" />
        <path d="M-8 34 L8 34 L0 58 Z" fill="#e8d9b8" />
        <path d="M-2.8 50 L2.8 50 L0 58 Z" fill="#071d17" />
      </L>
      <L t="translate(16 330)">
        <LilyPad size={46} tone="young" seed={41} notch={210} />
      </L>
    </svg>
  )
}

/* 05 — Tools of the trade: a spreadsheet, a terminal, a spark of AI */
function Tools() {
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <pattern id="tl-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#91c65a" strokeOpacity="0.08" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="300" height="380" fill="#174e3d" />
      <rect width="300" height="380" fill="url(#tl-grid)" />

      {/* spreadsheet */}
      <L t="translate(22 50) rotate(-5)">
        <rect width="190" height="170" rx="8" fill="#f3f0e3" />
        <rect x="10" y="10" width="170" height="14" rx="2" fill="#e8e1cf" />
        <text x="16" y="20" fontFamily={MONO} fontSize="7" fill="#092f25">
          fx =SUM(B2:B9)
        </text>
        {['', 'A', 'B', 'C', 'D'].map((h, i) => (
          <text key={i} x={14 + i * 36 + 14} y="38" textAnchor="middle" fontFamily={SANS} fontSize="6" fill="#477b50">
            {h}
          </text>
        ))}
        <g stroke="#092f25" strokeOpacity="0.15" strokeWidth="0.6">
          {Array.from({ length: 8 }, (_, r) => (
            <line key={r} x1="10" x2="180" y1={44 + r * 15} y2={44 + r * 15} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <line key={c} x1={10 + c * 34} x2={10 + c * 34} y1="44" y2="149" />
          ))}
        </g>
        {Array.from({ length: 7 }, (_, r) => (
          <g key={r}>
            <rect x="48" y={48 + r * 15} width={10 + ((r * 37) % 22)} height="6" rx="1" fill="#092f25" opacity="0.5" />
            <rect x="82" y={48 + r * 15} width={8 + ((r * 23) % 20)} height="6" rx="1" fill="#092f25" opacity="0.3" />
            <rect x="116" y={48 + r * 15} width={14 + ((r * 17) % 16)} height="6" rx="1" fill="#477b50" opacity="0.55" />
          </g>
        ))}
        <rect x="78" y="134" width="34" height="15" fill="none" stroke="#91c65a" strokeWidth="2" />
      </L>

      {/* terminal */}
      <L t="translate(70 196) rotate(4)">
        <rect x="3" y="5" width="214" height="134" rx="10" fill="#020c09" opacity="0.4" />
        <rect width="214" height="134" rx="10" fill="#071d17" stroke="#aab7a5" strokeOpacity="0.3" />
        <circle cx="16" cy="14" r="3.4" fill="#aab7a5" opacity="0.5" />
        <circle cx="28" cy="14" r="3.4" fill="#aab7a5" opacity="0.35" />
        <circle cx="40" cy="14" r="3.4" fill="#aab7a5" opacity="0.2" />
        <line x1="0" x2="214" y1="26" y2="26" stroke="#aab7a5" strokeOpacity="0.15" />
        <g fontFamily={MONO} fontSize="8.5">
          <text x="14" y="46" fill="#91c65a">
            $ <tspan fill="#f3f0e3">claude</tspan>
          </text>
          <text x="14" y="62" fill="#aab7a5">
            › research the market for me
          </text>
          <text x="14" y="80" fill="#f3f0e3">
            {'>>> import pandas as pd'}
          </text>
          <text x="14" y="96" fill="#f3f0e3">
            SELECT idea FROM <tspan fill="#91c65a">notes</tspan>;
          </text>
          <text x="14" y="114" fill="#91c65a">
            $
          </text>
        </g>
        <rect x="26" y="106" width="6" height="10" fill="#91c65a" />
      </L>

      {/* spark */}
      <L t="translate(246 70)">
        <path d="M0 -22 C2 -6 6 -2 22 0 C6 2 2 6 0 22 C-2 6 -6 2 -22 0 C-6 -2 -2 -6 0 -22 Z" fill="#91c65a" />
        <path d="M24 -26 C25 -20 26 -19 32 -18 C26 -17 25 -16 24 -10 C23 -16 22 -17 16 -18 C22 -19 23 -20 24 -26 Z" fill="#f3f0e3" opacity="0.8" />
      </L>
    </svg>
  )
}

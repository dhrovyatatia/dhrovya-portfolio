import { useId, useMemo } from 'react'

type Tone = 'fresh' | 'deep' | 'young'

interface Props {
  size?: number
  tone?: Tone
  /** angle in degrees of the notch */
  notch?: number
  flower?: boolean
  droplet?: boolean
  className?: string
  style?: React.CSSProperties
  seed?: number
}

const TONES: Record<Tone, [string, string, string, string]> = {
  // center, mid, edge, rim
  fresh: ['#6d9a55', '#4f8250', '#2f5c3c', '#91c65a'],
  deep: ['#3f6d47', '#2f5a3c', '#1d4430', '#6f9f5c'],
  young: ['#86b65c', '#6a9c52', '#3f6f43', '#b5d98c'],
}

/** Seeded, slightly imperfect lily pad drawn as an SVG. */
export function LilyPad({
  size = 160,
  tone = 'fresh',
  notch = -60,
  flower = false,
  droplet = false,
  className,
  style,
  seed = 1,
}: Props) {
  const uid = useId().replace(/:/g, '')
  const [c0, c1, c2, rim] = TONES[tone]

  const { pad, veins } = useMemo(() => {
    const rnd = mulberry(seed)
    const cx = 100
    const cy = 100
    const R = 84
    const half = 9 + rnd() * 5
    const a0 = ((notch + half) * Math.PI) / 180
    const a1 = ((notch - half + 360) * Math.PI) / 180
    // edge as many points with a gentle wobble, so no two pads are perfect circles
    const steps = 48
    const pts: string[] = []
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps
      const r = R * (1 + Math.sin(a * 3 + seed) * 0.018 + (rnd() - 0.5) * 0.012)
      pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`)
    }
    const padPath = `M${cx + 3},${cy} L${pts.join(' L')} Z`

    const v: string[] = []
    const count = 13
    for (let i = 1; i < count; i++) {
      const a = a0 + ((a1 - a0) * i) / count
      const bend = (rnd() - 0.5) * 0.12
      const mx = cx + Math.cos(a + bend) * R * 0.5
      const my = cy + Math.sin(a + bend) * R * 0.5
      const ex = cx + Math.cos(a) * R * 0.94
      const ey = cy + Math.sin(a) * R * 0.94
      v.push(`M${cx},${cy} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`)
    }
    return { pad: padPath, veins: v }
  }, [notch, seed])

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <radialGradient id={`g${uid}`} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor={c0} />
          <stop offset="55%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
        <radialGradient id={`h${uid}`} cx="35%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#f3f0e3" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f3f0e3" stopOpacity="0" />
        </radialGradient>
        <filter id={`s${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* shadow cast on the water below */}
      <path d={pad} fill="#010c08" opacity="0.55" filter={`url(#s${uid})`} transform="translate(7 10)" />

      <path d={pad} fill={`url(#g${uid})`} />
      <g stroke={rim} strokeOpacity="0.2" strokeWidth="0.9" fill="none" strokeLinecap="round">
        {veins.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <path d={pad} fill={`url(#h${uid})`} />
      <path d={pad} fill="none" stroke={rim} strokeOpacity="0.38" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="2.4" fill={rim} opacity="0.5" />

      {droplet && (
        <g>
          <ellipse cx="128" cy="72" rx="6" ry="5" fill="#f3f0e3" opacity="0.18" />
          <ellipse cx="126.5" cy="70.5" rx="2" ry="1.4" fill="#f3f0e3" opacity="0.75" />
        </g>
      )}

      {flower && <Lotus cx={88} cy={112} r={40} />}
    </svg>
  )
}

/** Top-down water lily bloom, nested inside a pad's SVG. */
export function Lotus({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const outer = Array.from({ length: 10 }, (_, i) => (i * 360) / 10)
  const inner = Array.from({ length: 8 }, (_, i) => (i * 360) / 8 + 22)
  return (
    <g>
      <ellipse cx={cx + 4} cy={cy + 6} rx={r * 0.9} ry={r * 0.85} fill="#010c08" opacity="0.35" />
      {outer.map((a) => (
        <ellipse
          key={`o${a}`}
          cx={cx}
          cy={cy - r * 0.5}
          rx={r * 0.2}
          ry={r * 0.52}
          fill="#e8e1cf"
          stroke="#aab7a5"
          strokeOpacity="0.6"
          strokeWidth="0.6"
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      {inner.map((a) => (
        <ellipse
          key={`i${a}`}
          cx={cx}
          cy={cy - r * 0.32}
          rx={r * 0.15}
          ry={r * 0.36}
          fill="#f3f0e3"
          stroke="#c9c1a8"
          strokeOpacity="0.7"
          strokeWidth="0.5"
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.17} fill="#91c65a" />
      <circle cx={cx} cy={cy} r={r * 0.1} fill="#c8d96a" opacity="0.8" />
    </g>
  )
}

function mulberry(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

import type { ExperimentArtKind } from '../../data/experiments'

/** Procedural lab plates. Replace with real imagery via `image` in data. */
export function ExperimentArt({ kind }: { kind: ExperimentArtKind }) {
  const common = { viewBox: '0 0 200 200', preserveAspectRatio: 'xMidYMid slice', className: 'h-full w-full', 'aria-hidden': true }
  switch (kind) {
    case 'ripples':
      return (
        <svg {...common}>
          <rect width="200" height="200" fill="#103f32" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx="78" cy="118" r={8 + i * 11} fill="none" stroke="#aab7a5" strokeOpacity={0.55 - i * 0.04} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={`b${i}`} cx="150" cy="50" r={5 + i * 9} fill="none" stroke="#91c65a" strokeOpacity={0.5 - i * 0.06} strokeWidth="0.7" />
          ))}
          <circle cx="78" cy="118" r="4" fill="#f3f0e3" />
        </svg>
      )
    case 'glyphs':
      return (
        <svg {...common}>
          <rect width="200" height="200" fill="#e8e1cf" />
          {'RKAGSE'.split('').map((g, i) => (
            <text
              key={i}
              x={34 + (i % 3) * 66}
              y={92 + Math.floor(i / 3) * 84}
              textAnchor="middle"
              fontFamily="Noto Serif Display Variable, serif"
              fontWeight={300 + i * 120}
              fontSize="76"
              style={{ fontStretch: `${62.5 + i * 7}%` }}
              fill={i === 4 ? '#477b50' : '#092f25'}
            >
              {g}
            </text>
          ))}
          <line x1="0" x2="200" y1="100" y2="100" stroke="#477b50" strokeOpacity="0.3" strokeWidth="0.5" />
        </svg>
      )
    case 'grid':
      return (
        <svg {...common}>
          <rect width="200" height="200" fill="#092f25" />
          {Array.from({ length: 100 }, (_, i) => {
            const x = 15 + (i % 10) * 19
            const y = 15 + Math.floor(i / 10) * 19
            const d = Math.hypot(x - 120, y - 80)
            const r = Math.max(0.8, 6 - d / 22)
            return <circle key={i} cx={x} cy={y} r={r} fill={d < 30 ? '#91c65a' : '#aab7a5'} opacity={d < 30 ? 0.9 : 0.55} />
          })}
        </svg>
      )
    case 'bloom':
      return (
        <svg {...common}>
          <rect width="200" height="200" fill="#071d17" />
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="62"
              rx="13"
              ry="40"
              fill="none"
              stroke={i % 2 ? '#aab7a5' : '#f3f0e3'}
              strokeOpacity="0.6"
              strokeWidth="0.7"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="10" fill="#91c65a" />
        </svg>
      )
    case 'orbit':
      return (
        <svg {...common}>
          <rect width="200" height="200" fill="#174e3d" />
          {[30, 52, 74, 94].map((r, i) => (
            <g key={r}>
              <ellipse cx="100" cy="100" rx={r} ry={r * 0.42} fill="none" stroke="#f3f0e3" strokeOpacity="0.35" strokeWidth="0.7" transform="rotate(-18 100 100)" />
              <circle
                cx={100 + r * Math.cos(i * 1.7)}
                cy={100 + r * 0.42 * Math.sin(i * 1.7)}
                r={3 + i}
                fill={i === 2 ? '#91c65a' : '#f3f0e3'}
                transform="rotate(-18 100 100)"
              />
            </g>
          ))}
          <circle cx="100" cy="100" r="14" fill="#e8e1cf" />
        </svg>
      )
    case 'stems':
      return (
        <svg {...common}>
          <rect width="200" height="200" fill="#e8e1cf" />
          {Array.from({ length: 18 }, (_, i) => {
            const x = 12 + i * 10.5
            const h = 60 + Math.sin(i * 1.3) * 34 + (i % 3) * 12
            return (
              <g key={i}>
                <path d={`M${x} 200 C${x - 4} ${200 - h / 2} ${x + 6} ${200 - h * 0.8} ${x + 2} ${200 - h}`} fill="none" stroke="#477b50" strokeWidth="1" />
                <circle cx={x + 2} cy={200 - h} r={i % 4 === 0 ? 4 : 2} fill={i % 4 === 0 ? '#092f25' : '#477b50'} />
              </g>
            )
          })}
        </svg>
      )
  }
}

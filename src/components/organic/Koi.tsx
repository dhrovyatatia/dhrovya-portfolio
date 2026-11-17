/** A pale koi, seen from above, drawn to swim toward +x. */
export function Koi({ width = 130, className }: { width?: number; className?: string }) {
  return (
    <svg viewBox="0 0 160 64" width={width} height={(width * 64) / 160} className={className} aria-hidden>
      {/* tail — wiggles */}
      <g className="koi-tail" style={{ transformOrigin: '42px 32px' }}>
        <path
          d="M44 32 C30 22 16 10 4 12 C12 22 14 28 12 32 C14 36 12 42 4 52 C16 54 30 42 44 32 Z"
          fill="#e8e1cf"
          opacity="0.75"
        />
        <path d="M40 32 C28 24 18 16 8 15" stroke="#aab7a5" strokeOpacity="0.5" strokeWidth="0.6" fill="none" />
        <path d="M40 32 C28 40 18 48 8 49" stroke="#aab7a5" strokeOpacity="0.5" strokeWidth="0.6" fill="none" />
      </g>
      {/* pectoral fins */}
      <path d="M104 24 C98 10 88 6 82 8 C88 14 92 20 96 26 Z" fill="#e8e1cf" opacity="0.6" />
      <path d="M104 40 C98 54 88 58 82 56 C88 50 92 44 96 38 Z" fill="#e8e1cf" opacity="0.6" />
      {/* body */}
      <path
        d="M40 32 C52 22 80 17 112 19 C136 20 152 26 155 32 C152 38 136 44 112 45 C80 47 52 42 40 32 Z"
        fill="#f3f0e3"
      />
      {/* markings */}
      <path d="M88 20 C98 18 110 22 112 30 C104 30 94 28 88 20 Z" fill="#477b50" opacity="0.55" />
      <path d="M62 38 C70 44 82 44 86 40 C78 36 70 36 62 38 Z" fill="#477b50" opacity="0.4" />
      <ellipse cx="140" cy="27" rx="1.6" ry="1.2" fill="#071d17" opacity="0.6" />
      <ellipse cx="140" cy="37" rx="1.6" ry="1.2" fill="#071d17" opacity="0.6" />
    </svg>
  )
}

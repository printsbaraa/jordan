interface JordanFlagProps {
  /** 'stripe' renders the three horizontal bands. 'full' renders the complete flag with star. */
  variant?: 'stripe' | 'full'
  className?: string
  height?: number | string
}

/**
 * Pure SVG Jordanian flag — no external image required.
 * Colours per Jordan's official vexillology standards.
 */
export function JordanFlag({ variant = 'full', className = '', height = 80 }: JordanFlagProps) {
  if (variant === 'stripe') {
    return (
      <div
        className={className}
        style={{ width: '100%', height: 4, display: 'flex' }}
        aria-hidden="true"
      >
        <div style={{ flex: 1, background: '#007A3D' }} />
        <div style={{ flex: 1, background: '#FFFFFF' }} />
        <div style={{ flex: 1, background: '#CE1126' }} />
        <div style={{ flex: 1, background: '#000000' }} />
      </div>
    )
  }

  // Full flag: 1:2 ratio. Three equal horizontal bands with a red triangle and white star.
  const w = typeof height === 'number' ? height * 2 : '100%'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 600"
      width={w}
      height={height}
      className={className}
      role="img"
      aria-label="Flag of the Hashemite Kingdom of Jordan"
    >
      {/* Three horizontal bands */}
      <rect width="1200" height="200" y="0"   fill="#000000" />
      <rect width="1200" height="200" y="200" fill="#FFFFFF" />
      <rect width="1200" height="200" y="400" fill="#CE1126" />

      {/* Red triangle on hoist side */}
      <polygon points="0,0 600,300 0,600" fill="#CE1126" />

      {/* White 7-pointed star */}
      {/* The star's 7 points represent the seven verses of Al-Fatiha and the seven Hashemite hills */}
      <g transform="translate(220 300)">
        <polygon
          fill="#FFFFFF"
          points={sevenPointStar(0, 0, 72, 30)}
        />
      </g>
    </svg>
  )
}

/** Generate a 7-pointed star polygon string centred at (cx, cy) */
function sevenPointStar(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = []
  const n = 7
  for (let i = 0; i < n * 2; i++) {
    const angle = (Math.PI * i) / n - Math.PI / 2
    const r = i % 2 === 0 ? outerR : innerR
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`)
  }
  return points.join(' ')
}

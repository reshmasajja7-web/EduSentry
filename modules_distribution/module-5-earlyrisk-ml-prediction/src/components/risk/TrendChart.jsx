export default function TrendChart({ title, data, dataKey, color }) {
  const width = 300
  const height = 150
  const pad = 28
  const values = data.map((d) => d[dataKey])
  const max = Math.max(...values) * 1.2 || 1
  const stepX = (width - pad * 2) / (data.length - 1)
  const points = data.map((d, i) => {
    const x = pad + i * stepX
    const y = height - pad - (d[dataKey] / max) * (height - pad * 2)
    return { x, y, d }
  })
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="rounded-xl border border-[#263653] bg-[#0e1626] p-5">
      <h4 className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-slate-300 font-semibold">{title}</h4>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={width - pad}
            y1={height - pad - f * (height - pad * 2)}
            y2={height - pad - f * (height - pad * 2)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
            <text x={p.x} y={height - 8} fontSize="10" fill="#CBD5E1" fontFamily="monospace" textAnchor="middle">
              {p.d.week}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
